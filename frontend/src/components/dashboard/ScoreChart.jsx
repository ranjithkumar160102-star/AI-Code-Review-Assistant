import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const ScoreChart = ({ data = [] }) => {
  console.log("Score Chart Data:", data);

  const chartData = data
  .filter(item => item.score > 0)
  .slice(0, 6)
  .map((item, index) => {
    const rawName = item.file || `Review ${index + 1}`;

    return {
      file:
        rawName.length > 20
          ? rawName.substring(0, 20) + "..."
          : rawName,
      score: item.score,
    };
  });

  console.log("Chart Data =", chartData);

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-xl font-bold mb-4">
        Review Scores
      </h2>

      {chartData.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No review data
        </div>
      ) : (
        <BarChart
  width={600}
  height={320}
  data={chartData}
>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="file"
              angle={-30}
              textAnchor="end"
              interval={0}
              height={70}
            />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Bar
              dataKey="score"
              fill="#2563eb"
            />
         </BarChart>
      )}
    </div>
  );
};

export default ScoreChart;