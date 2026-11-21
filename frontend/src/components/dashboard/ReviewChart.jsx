import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const ReviewChart = ({ type = "bar", reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Review Analytics
        </h2>

        <p className="text-gray-500">
          No review data available.
        </p>
      </div>
    );
  }

  const labels = reviews.map((review) =>
    review.fileName.length > 15
      ? review.fileName.substring(0, 15) + "..."
      : review.fileName
  );

  const scores = reviews.map((review) => review.score);

  const barData = {
    labels,
    datasets: [
      {
        label: "Review Score",
        data: scores,
        backgroundColor: "#2563eb",
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Score Trend",
        data: scores,
        borderColor: "#16a34a",
        backgroundColor: "#16a34a",
        tension: 0.4,
      },
    ],
  };

  const languageMap = {};

  reviews.forEach((review) => {
    languageMap[review.language] =
      (languageMap[review.language] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(languageMap),
    datasets: [
      {
        data: Object.values(languageMap),
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Review Analytics
      </h2>

      {type === "bar" && <Bar data={barData} />}

      {type === "line" && <Line data={lineData} />}

      {type === "pie" && <Pie data={pieData} />}
    </div>
  );
};

export default ReviewChart;