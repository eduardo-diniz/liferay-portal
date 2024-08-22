/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.partner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import java.net.URL;

import java.util.LinkedHashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Eduardo Diniz
 */
@RequestMapping("/file-validation")
@RestController
public class QualifiedLeadsTemplateValidatorController
	extends BaseRestController {

	@PostMapping("/validate")
	public ResponseEntity<String> validateFile(
		@AuthenticationPrincipal Jwt jwt,
		@RequestParam("file") MultipartFile file,
		HttpServletRequest httpServletRequest) {

		try {
			Set<String> fileColumns = _extractColumns(file);
			Set<String> templateColumns = _extractColumnsFromTemplate();

			if (fileColumns.equals(templateColumns)) {
				return ResponseEntity.ok("File is valid.");
			}

			return ResponseEntity.badRequest(
			).body(
				"File is invalid. Columns do not match the template."
			);
		}
		catch (IOException ioException) {
			return ResponseEntity.status(
				500
			).body(
				"Error processing file: " + ioException.getMessage()
			);
		}
	}

	private Set<String> _extractColumns(MultipartFile file) throws IOException {
		String contentType = file.getContentType();

		if ((contentType != null) && contentType.equals("text/csv")) {
			return _extractColumnsFromCSV(file.getInputStream());
		}

		return _extractColumnsFromExcel(file.getInputStream());
	}

	private Set<String> _extractColumnsFromCSV(InputStream inputStream)
		throws IOException {

		Set<String> columns = new LinkedHashSet<>();

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(inputStream))) {

			int maxLines = 2;

			for (int lineNumber = 0; lineNumber < maxLines; lineNumber++) {
				String line = reader.readLine();

				if (line == null) {
					break;
				}

				String[] headers = line.split(",");

				for (String header : headers) {
					String normalizedHeader = _normalizeHeader(header);

					if (!normalizedHeader.isEmpty()) {
						columns.add(normalizedHeader);
					}
				}
			}
		}

		return columns;
	}

	private Set<String> _extractColumnsFromExcel(InputStream inputStream)
		throws IOException {

		Set<String> columns = new LinkedHashSet<>();

		try (Workbook workbook = WorkbookFactory.create(inputStream)) {
			Sheet sheet = workbook.getSheetAt(0);

			for (Row row : sheet) {
				if ((row == null) || (row.getRowNum() > 1)) {
					break;
				}

				for (Cell cell : row) {
					String cellValue = _normalizeHeader(
						_getCellValueAsString(cell));

					if (!cellValue.isEmpty()) {
						columns.add(cellValue);
					}
				}
			}
		}

		return columns;
	}

	private Set<String> _extractColumnsFromTemplate() throws IOException {
		try (InputStream templateInputStream = new URL(
				_portalURL
			).openStream()) {

			return _extractColumnsFromExcel(templateInputStream);
		}
	}

	private String _getCellValueAsString(Cell cellInputStream) {
		if (cellInputStream.getCellType() == CellType.BOOLEAN) {
			return String.valueOf(cellInputStream.getBooleanCellValue());
		}
		else if (cellInputStream.getCellType() == CellType.FORMULA) {
			return cellInputStream.getCellFormula();
		}
		else if (cellInputStream.getCellType() == CellType.NUMERIC) {
			return String.valueOf(cellInputStream.getNumericCellValue());
		}
		else if (cellInputStream.getCellType() == CellType.STRING) {
			return cellInputStream.getStringCellValue();
		}

		return "";
	}

	private String _normalizeHeader(String header) {
		return header.trim(
		).toLowerCase();
	}

	@Value("${url.path}")
	private String _portalURL;

}