import React from 'react'
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
    title = 'Hard'
}: DifficultyTestReportChartProps) => {
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
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        annotations: [
            {
                type: 'text',
                content: title,
                text: title,
                style: {
                    text: 'AntV\nCharts',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold',
                },
            },
        ],
    };
    return (
        <React.Fragment>
            {/* @ts-ignore */}
            <Pie {...config} />
        </React.Fragment>
    );
};

export default DifficultyTestReportChart;
