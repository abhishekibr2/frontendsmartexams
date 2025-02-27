import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Q1', time: 0 },
    { name: 'Q2', time: 1 },
    { name: 'Q3', time: 2 },
    { name: 'Q4', time: 3 },
    { name: 'Q5', time: 4 },
    { name: 'Q6', time: 5 },
    { name: 'Q7', time: 6 },
    { name: 'Q8', time: 7 },
    { name: 'Q9', time: 8 },
    { name: 'Q10', time: 9 },
    { name: 'Q11', time: 10 },
    { name: 'Q12', time: 11 },
    { name: 'Q13', time: 12 },
    { name: 'Q14', time: 13 },
    { name: 'Q15', time: 14 },
    { name: 'Q16', time: 15 },
];

const TimingChart = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                layout="vertical" // Set layout to vertical for Y-axis as Questions
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Time (Minutes)', position: 'insideBottom', offset: -10 }} />
                <YAxis type="category" dataKey="name" label={{ value: 'Questions', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TimingChart;
