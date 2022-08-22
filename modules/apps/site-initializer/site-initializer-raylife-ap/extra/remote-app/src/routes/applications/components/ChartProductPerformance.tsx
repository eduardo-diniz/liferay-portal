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

import ClayChart from '@clayui/charts';
import React from 'react';


type BarChartPerformanceProps = {
    chartConfiguration: {
        axis?: {
        x?: { 
            height?: number,
            label?:{postition?: string, text?: string},
            labelColumns?:string[],
            padding?: {left?: number, right?: number},
            show?: boolean,
            type?: string,
            width?: number,
        },
        y?:{
            height?: number,
            label?:{postition?: string , text?: string},
            show?: boolean,
            tick?: {format?: (x: any) => string, stepSize?: number}
            width?: number,
        } 
    },
        
    bar?: {
        width?: number
    },
    data: {
        colors?:{[keys:string] : {}},
        columns:string[],
        groups?:string[],
        order?: () => void,
        type?: string,
    },
    grid?: {
        x?: {
            show?: boolean,
        },
        y?: {
            show?: boolean,
        }
    },
    legend?: {
        show?: boolean,
    },
    padding?: {
        right?: number
    },
    ref?: any,
    size?: {
        height?: number,
        width?: number,
    },
    tooltip?: {
        show?: boolean,
    }}
}


const ChartProductPerformance: React.FC<BarChartPerformanceProps> = ({chartConfiguration}) => {

        return (
        <ClayChart
            data={chartConfiguration.data}
        />)

}

export default ChartProductPerformance;