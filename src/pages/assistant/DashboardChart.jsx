// src/components/DashboardChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [3, 5, 2, 6, 4, 1, 7],
        borderColor: '#2563EB', // blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#1E3A8A', // blue-900
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#1F2937' // gray-800
        }
      },
      y: {
        ticks: {
          color: '#1F2937' // gray-800
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-3 h-fit" >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointments</h2>
      <div className="w-full h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
