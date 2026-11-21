import { useEffect, useState } from "react";
import api from "../../api/api";

import LanguageChart from "../../components/dashboard/LanguageChart";
import ScoreChart from "../../components/dashboard/ScoreChart";
import { exportToPDF } from "../../utils/pdfExport";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    languages: 0,
    recentReviews: 0,
    languageChart: [],
    scoreChart: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/reviews/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        }
      );

      console.log("Dashboard Stats:", res.data.data);
      console.log("Score Chart =", res.data.data.scoreChart);
      console.log(JSON.stringify(res.data.data.scoreChart, null, 2));

      setStats(res.data.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ title, value, color }) => (
    <div
      className={`rounded-xl p-6 shadow-md text-white ${color}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">
    Dashboard
  </h1>

  <button
  onClick={() => exportToPDF(stats)}
  className="bg-red-600 text-white px-5 py-2 rounded-lg"
>
  Export PDF
</button>
</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card
          title="Total Reviews"
          value={stats.totalReviews}
          color="bg-blue-600"
        />

        <Card
          title="Average Score"
          value={`${stats.averageScore}/100`}
          color="bg-green-600"
        />

        <Card
          title="Languages"
          value={stats.languages}
          color="bg-purple-600"
        />

        <Card
          title="Recent Reviews"
          value={stats.recentReviews}
          color="bg-orange-600"
        />
      </div>

      {/* Welcome */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to AI Code Review Assistant
        </h2>

        <p className="text-gray-600 leading-7">
          AI Code Review Assistant helps you review source
          code, analyze GitHub repositories, track review
          history, monitor quality scores and improve
          software quality using AI.
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <LanguageChart
          data={stats.languageChart || []}
        />

        <div className="bg-white p-5 rounded-xl shadow">
  <ScoreChart data={stats.scoreChart} />
</div>
      </div>
    </div>
  );
};

export default Dashboard;