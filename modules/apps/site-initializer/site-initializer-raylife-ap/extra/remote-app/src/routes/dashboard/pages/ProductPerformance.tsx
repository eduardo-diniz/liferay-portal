/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayChart from '@clayui/charts';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import { dragDisable } from 'd3-drag';
import { NONAME } from 'dns';
import React, {useState} from 'react';

import Header from '../../../common/components/header';

const PRODUCT_LIST = [
	'All',
	'Auto',
	'General Liability',
	'Professional Liability',
	'Workers Compensation',
	'Business Owners Policy',
];

const TIME_PERIODS = ['YTD', '3 MO', '6 MO'];


type BarChartPerformanceTypes = {
    colors: string[],
	dataColumns: string[],
	height: number,
    groups: string[],
	labelColumns: string[],
	showLegend: boolean,
	showTooltip: boolean,
	titleTotal: boolean,
	totalSum: number,
	width: number,
}

const colors:string[] = [
    '#DCF1FD',
    '#55C2FF',
    '#FFD76E',
];

const dataColumn: any = {
	threeMonths: {

		
	},

	sixMonths: {

		
	},
	
	yearly: {
		jan:{
			currentValue: 300,
			goals: 200,
			exceeded: 300
			}	
		,
		feb:{
			currentValue: 25,
			goals: 210,
			exceeded: 300

		},
			
		mar:{
			
			currentValue: 25,
			goals: 250,
			exceeded: 300

		}
			,
		apr:{
			
			currentValue: 25,
			goals: 320,
			exceeded: 300

		}
			,
		may:{
			
			currentValue: 25,
			goals: 200,
			exceeded: 300

		}
			,
		jun:
		{
			currentValue: 25,
			goals: 120,
			exceeded: 300

		}
			,
		jul:
		{
			currentValue: 25,
			goals: 320,
			exceeded: 300

		}
			,
		aug:
		{
			currentValue: 25,
			goals: 220,
			exceeded: 300

		}
			,
		sep:
		
		{  
			currentValue: 25,
			goals: 20,
			exceeded: 300

		}	
		,
	
		oct:
		{
			currentValue: 25,
			goals: 320,
			exceeded: 300

		}
			,
		nov:
		{
			currentValue: 25,
			goals: 420,
			exceeded: 300

		}
			,
		dec:
		{
			currentValue: 25,
			goals: 210,
			exceeded: 300

		}
			,

	}	,

	
}



const chart=  {
	data: {
		columns: [
		["goal", 200, 200, 200, 400, 150, 250],
		["exceeded", 30, 100, 100, 200, 150, 50],
		["achieved", 230, 200, 200, 300, 250, 250]
		], 
		groups: [
			[
				'goal',
				'exceeded',
				'achieved'
			]
		],
		type: "bar", 
		},

};

const achieved = Object.values(dataColumn.yearly).map((item: any) => item.currentValue)
const goals = Object.values(dataColumn.yearly).map((item: any) => item.goals)
const exceeded = Object.values(dataColumn.yearly).map((item: any) => item.exceeded)


const dataChart: any = {

	data:{

		columns: [
			
			["achieved",  ...achieved],
			["goals", ...goals ],
			["exceeded", ...exceeded ],
		],
		groups: [
			[
				'goals',
				'achieved',
				'exceeded',
				
			]
		],
		
	}
}




const labelColumns = [
	'Jan 2022',
	'Feb 2022',
	'Mar 2022',
	'Apr 2022',
	'May 2022',
	'Jun 2022',
	'Jul 2022',
	'Ago 2022',
	'Sep 2022',
	'Oct 2022',
	'Nov 2022',
	'Dec 2022',
];


const BarChartPerformancee: BarChartPerformanceTypes  = {
    colors:[],
	dataColumns:[],
	height : 338,
    groups : [''],
	labelColumns:[],
	showLegend : false,
	showTooltip : true,
	titleTotal : true,
	totalSum : 0,
	width : 700,
}


const ProductPerformance = () => {
	const [choosenProduct, setChoosenProduct] = useState(PRODUCT_LIST[0]);
	const [timePeriod, setTimePeriod] = useState(TIME_PERIODS[0]);

	return (
		<div className="d-flex flex-wrap ray-dashboard-product-performance">
			<div className="col-5 left-container px-0">
				<Header
					className="header-row px-4 py-3"
					title="Product Performance"
				/>

				<div className="p-5"></div>
			</div>

			<div className="col-7 px-0 right-container">
				<div className="align-items-center d-flex header-row justify-content-between px-4 py-3">
					<p className="m-0 text-paragraph">
						<ClayButton
							className={classNames('general-filter mr-1', {
								'font-weight-bolder': choosenProduct === 'All',
							})}
							displayType="unstyled"
							onClick={() => setChoosenProduct('All')}
						>
							All
						</ClayButton>

						{choosenProduct !== 'All' && (
							<>
								<ClayIcon
									className="font-weight-bolder mr-1"
									symbol="angle-right-small"
								/>

								<span className="font-weight-bolder">{`${choosenProduct}`}</span>
							</>
						)}
					</p>

					<ClaySelect
						className="product-performance-select"
						onChange={({target}) => {
							setTimePeriod(target.value);
						}}
						sizing="sm"
						value={timePeriod}
					>
						{TIME_PERIODS.map((timePeriod, index) => (
							<ClaySelect.Option
								key={index}
								label={timePeriod}
								value={timePeriod}
							/>
						))}
					</ClaySelect>
				</div>

				<div className="p-5 overflow-auto" > 

			
				
				<ClayChart
					
				axis={{
					x: {
						type: 'category',
						show: true,
						categories: [...labelColumns],
						position:{x: 30},

						tick:{

							position:{x: 30},
							

					},
						

					},
					y: {
						
						show: true,
						tick: {
							format: function(x:any) {return '$' + x}


							}

					},
				}}
				bar={{
					radius: {
						ratio: 0.2,
					},
					width: {
						data: 20,
					},
					


				}}
				data={{
					columns:dataChart.data.columns,
                    groups: dataChart.data.groups,
					type: chart.data.type,

					colors: colors,
				
				}}



				grid={{
					y: {

						lines: [
							{
								value: 150,
								text: "Label 50 for y"
							},
				
							]
						}
					}}
				
				legend={{
					show: false,
					item: {
						onclick: (id: any) => {return false},
						onover: (id: any) =>  {return false},
						onout: (id: any) =>  {return false},

					},
					label:{

						position:{y: + 30},
						
					},
					position:{y: -30},


				}}
				size={{
					height: BarChartPerformancee.height,
					width: BarChartPerformancee.width
				}}
				tooltip={{
					show: false,
				}}
				
				/>	
					
					<div className='legend'>
					goals
					achieved
					exceededs
					</div>

					</div>

				</div>
			</div>
	);
};

export default ProductPerformance;
