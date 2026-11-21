import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#0891b2",
];

const LanguageChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-xl font-bold mb-4">
        Language Distribution
      </h2>

      {data.length === 0 ? (
        <div className="h-[300px] flex justify-center items-center text-gray-500">
          No language data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="language"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Legend />

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LanguageChart;