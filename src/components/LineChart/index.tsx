// components/HorizontalBarChart.tsx
import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

// Register the necessary components
// ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface HorizontalBarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    };
}

const HorizontalBarChart = ({ data }: HorizontalBarChartProps) => {
    // Define chart options with the correct type for `indexAxis`
    // const options: ChartOptions<'bar'> = {
    //     responsive: true,
    //     // indexAxis: 'y', // Use 'y' to make the chart horizontal
    //     plugins: {
    //         legend: {
    //             position: 'top' as const,
    //         },
    //         tooltip: {
    //             callbacks: {
    //                 label: function (context) {
    //                     return context.dataset.label + ': ' + context.raw;
    //                 }
    //             }
    //         }
    //     },
    //     scales: {
    //         x: {
    //             beginAtZero: true
    //         },
    //         y: {
    //             beginAtZero: true
    //         }
    //     }
    // };

    // return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;
