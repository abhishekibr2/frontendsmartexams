import React from 'react';
import { Bar } from '@ant-design/plots';

export default function ReportByGroupChart({ groupedByTopic }: any) {
    const data = Object.entries(groupedByTopic).map(([topic, stats]: any) => {
        const correctAnswers =
            stats.correct
        const incorrectAnswers =
            stats.incorrect;

        return [
            {
                topic: stats.topic,
                type: 'Correct',
                value: correctAnswers,
            },
            {
                topic: stats.topic,
                type: 'Incorrect',
                value: incorrectAnswers,
            },
        ];
    }).flat();


    const config = {
        data: data,
        isStack: true,
        yField: 'topic',
        xField: 'value',
        seriesField: 'type',
        label: {
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        color: ['#5CB85C', '#D81B60']
    };

    // @ts-ignore
    return <Bar {...config} />;
}
