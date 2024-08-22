package com.liferay.partner;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.LinkedHashSet;
import java.util.Set;

@RestController
@RequestMapping("/file-validation")
public class QualifiedLeadsTemplateValidatorController extends BaseRestController {

    @Value("${url.path}")
    private String portalURL;

    @PostMapping("/validate")
    public ResponseEntity<String> validateFile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            Set<String> fileColumns = extractColumns(file);
            Set<String> templateColumns = extractColumnsFromTemplate();

            if (fileColumns.equals(templateColumns)) {
                return ResponseEntity.ok("File is valid.");
            } else {
                return ResponseEntity.badRequest().body("File is invalid. Columns do not match the template.");
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
        }
    }

    private Set<String> extractColumns(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType != null && contentType.equals("text/csv")) {
            return extractColumnsFromCSV(file.getInputStream());
        } else {
            return extractColumnsFromExcel(file.getInputStream());
        }
    }

    private Set<String> extractColumnsFromCSV(InputStream inputStream) throws IOException {
        Set<String> columns = new LinkedHashSet<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null && lineNumber < 2) {
                String[] headers = line.split(",");
                for (String header : headers) {
                    String normalizedHeader = normalizeHeader(header);
                    if (!normalizedHeader.isEmpty()) {
                        columns.add(normalizedHeader);
                    }
                }
                lineNumber++;
            }
        }
        return columns;
    }

    private Set<String> extractColumnsFromExcel(InputStream inputStream) throws IOException {
        Set<String> columns = new LinkedHashSet<>();
        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);

            for (int rowIndex = 0; rowIndex <= 1; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row != null) {
                    for (Cell cell : row) {
                        String cellValue = normalizeHeader(getCellValueAsString(cell));
                        if (!cellValue.isEmpty()) {
                            columns.add(cellValue);
                        }
                    }
                }
            }
        }
        return columns;
    }

    private Set<String> extractColumnsFromTemplate() throws IOException {
        try (InputStream templateStream = new URL(portalURL).openStream()) {
            return extractColumnsFromExcel(templateStream);
        }
    }

    private String normalizeHeader(String header) {
        return header.trim().toLowerCase();
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
}
