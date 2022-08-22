import ClayChart from '@clayui/charts'
import React from "react";

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
	yearly: {
		jan:[
			{goals: 200,
			currentValue: 25}
		],
		feb:[
			{goals: 210,
			currentValue: 25}
		],
		mar:[
			{goals: 250,
			currentValue: 25}
		],
		apr:[
			{goals: 320,
			currentValue: 25}
		],
		may:[
			{goals: 200,
			currentValue: 25}
		],
		jun:[
			{goals: 120,
			currentValue: 25}
		],
		jul:[
			{goals: 320,
			currentValue: 25}
		],
		aug:[
			{goals: 220,
			currentValue: 25}
		],
		sep:[
			{goals: 20,
			currentValue: 25}
		],
		oct:[
			{goals: 320,
			currentValue: 25}
		],
		nov:[
			{goals: 420,
			currentValue: 25}
		],
		dec:[
			{goals: 210,
			currentValue: 25}
		],

	}	,
	threeMonths: {

		
	},
	sixMonths: {

		
	}	
}

const labelColumns:string[] = [
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
    colors:[''],
	dataColumns:[''],
	height : 200,
    groups : [''],
	labelColumns:[''],
	showLegend : false,
	showTooltip : false,
	titleTotal : true,
	totalSum : 0,
	width : 300,
}

const BarChartPerformance = () => {

    return(
        <div className="align-items-center bar-chart d-flex justify-content-between mb-3 mt-2">
			{BarChartPerformancee.titleTotal && (
				<div className="bar-chart-title px-4">
					<h6 className="mb-0 text-neutral-6">Total</h6>

					<h1 className="font-weight-bold">{BarChartPerformancee.totalSum}</h1>
				</div>
			)}

			<ClayChart
				axis={{
					x: {
						type: 'category',
					},
					y: {
						show: false,
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
					
					columns: [BarChartPerformancee.labelColumns, BarChartPerformancee.dataColumns],
					labels: {
						colors: '#272833',
						position: {
							y: -10,
						},
					},
                    groups: [dataColumn.yearly.jan.goal, dataColumn.yearly.jan.currentValue],
					type: 'bar',
					x: 'x',
				}}
				legend={{
					show: BarChartPerformancee.showLegend,
				}}
				size={{
					height: BarChartPerformancee.height,
					width: BarChartPerformancee.width
				}}
				tooltip={{
					show: BarChartPerformancee.showTooltip,
				}}
			/>
		</div>
    )
	

}

export default BarChartPerformance;