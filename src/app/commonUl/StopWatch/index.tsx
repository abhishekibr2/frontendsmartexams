'use client'
import { Typography } from 'antd';
// @ts-ignore
import ReactStopwatch from 'react-stopwatch';

const Stopwatch = () => (
    <ReactStopwatch
        seconds={0}
        minutes={0}
        hours={0}
        onChange={({ hours, minutes, seconds }: any) => {
            // do something
        }}
        onCallback={() => console.log('Finish')}
        render={({ formatted, hours, minutes, seconds }: any) => {
            return (
                <Typography.Text type='secondary'>
                    {formatted}
                </Typography.Text>
            );
        }}
    />
);

export default Stopwatch;
