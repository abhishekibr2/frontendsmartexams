import React from 'react';
import { Bar } from '@ant-design/plots';

export default function ReportByGroupChart({ groupedByTopic }: any) {
    const data = Object.entries(groupedByTopic).map(([topic, stats]: any) => {
        return [
            {
                topic: stats.topic,
                type: 'Correct',
                value: stats.correct,
            },
            {
                topic: stats.topic,
                type: 'Incorrect',
                value: stats.incorrect,
            },
        ];
    }).flat();

    const chartHeight = data.length / 2 * 50 + 100;

    const config = {
        data,
        isStack: true,
        yField: 'topic',
        xField: 'value',
        seriesField: 'type',
        barStyle: {
            radius: [4, 4, 0, 0],
        },
        minBarHeight: 50,
        maxBarHeight: 50,
        label: {
            position: 'middle',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' },
            ],
        },
        color: ['#5CB85C', '#D81B60'],
        height: chartHeight,
    };

    // @ts-ignore
    return <Bar {...config} />;
}
