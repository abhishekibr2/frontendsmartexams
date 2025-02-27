import React from 'react';
import { Pie } from '@ant-design/plots';
import { Typography } from 'antd';

interface DifficultyTestReportChartProps {
    correctAnswer: number;
    incorrectAnswer: number;
    unanswered: number;
    title?: string;
}

const DifficultyTestReportChart = ({
    correctAnswer = 0,
    incorrectAnswer = 0,
    unanswered = 0,
    title = 'Hard',
}: DifficultyTestReportChartProps) => {
    // Check if all values are zero
    const isEmpty = correctAnswer === 0 && incorrectAnswer === 0 && unanswered === 0;

    if (isEmpty) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', fontSize: '16px', fontWeight: 'bold', color: '#aaa' }}>
                No Data Available
            </div>
        );
    }

    const config = {
        data: [
            { type: 'Correct', value: correctAnswer },
            { type: 'Incorrect', value: incorrectAnswer },
            { type: 'Unanswered', value: unanswered },
        ],
        angleField: 'value',
        colorField: 'type',
        color: ['#5CB85C', '#D81B60', '#F0AD4E'],
        innerRadius: 0.6,
        label: {
            text: 'value',
            style: { fontWeight: 'bold' },
        },
        legend: {
            color: { title: false, position: 'right', rowPadding: 5 },
        },
        annotations: [
            {
                type: 'text',
                content: title,
                text: title,
                style: {
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontWeight: 'bold',
                },
            },
        ],
    };
    // @ts-ignore
    return <Pie {...config} />;
};

export default DifficultyTestReportChart;
