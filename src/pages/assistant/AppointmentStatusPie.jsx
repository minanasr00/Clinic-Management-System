
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AppointmentStatusPie = () => {
  const data = {
    labels: ["Confirmed", "Pending"],
    datasets: [
      {
        label: "Appointments",
        data: [32, 18], // عدد المواعيد المؤكدة مقابل المعلقة
        backgroundColor: ["#2563EB", "#F59E2B"], // blue, amber
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1F2937",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-2 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Appointment Status
      </h2>
      <div className="w-500 max-w-sm mx-auto h-fit">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default AppointmentStatusPie;
