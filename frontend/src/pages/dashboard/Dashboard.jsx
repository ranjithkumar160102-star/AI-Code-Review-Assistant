import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useAuth } from "../../context/AuthContext";

import { uploadFile } from "../../api/uploadApi";
import { getDashboardStats } from "../../api/reviewApi";
import { reviewGithubRepository } from "../../api/githubApi";

import ReviewHistory from "../../components/reviews/ReviewHistory";

const Dashboard = () => {
  const { user } = useAuth();

  // -----------------------------
  // Upload Review States
  // -----------------------------
  const [selectedFile, setSelectedFile] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Dashboard Stats
  // -----------------------------
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    languagesUsed: 0,
    todayReviews: 0,
  });

  // -----------------------------
  // GitHub Review States
  // -----------------------------
  const [repoUrl, setRepoUrl] = useState("");

  const [githubLoading, setGithubLoading] = useState(false);

  const [githubReviews, setGithubReviews] = useState([]);

  const [repositorySummary, setRepositorySummary] = useState("");

  // -----------------------------
  // Load Dashboard Stats
  // -----------------------------
  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data);
    } catch (error) {
      console.error("Stats Error:", error);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // -----------------------------
  // Upload Local File
  // -----------------------------
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadFile(selectedFile);

      console.log("Upload Response:", response);

      setReview(response.data.data || response.data);

      loadDashboardStats();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // GitHub Repository Review
  // -----------------------------
  const handleGithubReview = async () => {
    if (!repoUrl) {
      alert("Enter Repository URL");
      return;
    }

    try {
      setGithubLoading(true);

      const response = await reviewGithubRepository(repoUrl);

      console.log("GitHub Response:", response);

      setGithubReviews(response.reviews || []);

      setRepositorySummary(
        response.repositorySummary || ""
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Repository Review Failed"
      );
    } finally {
      setGithubLoading(false);
    }
  };
 
  // -----------------------------
  // Download PDF
  // -----------------------------
  
  const downloadPdf = () => {
  if (!review) return;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Code Review Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`File: ${review.fileName}`, 20, 35);
  doc.text(`Language: ${review.language}`, 20, 45);
  doc.text(`Score: ${review.score || "N/A"}`, 20, 55);

  const reviewText = review.aiReview || "";

  const lines = doc.splitTextToSize(reviewText, 170);

  doc.text(lines, 20, 70);

  doc.save("AI-Code-Review.pdf");
};

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

                {/* Header */}
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-3xl font-bold">
            AI Code Review Assistant
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome <b>{user?.name}</b> 👋
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">
              Total Reviews
            </h3>

            <p className="text-4xl font-bold mt-3 text-purple-600">
              {stats.totalReviews}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">
              Average Score
            </h3>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {stats.averageScore}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">
              Languages Used
            </h3>

            <p className="text-4xl font-bold mt-3 text-blue-600">
              {stats.languagesUsed}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-gray-500">
              Today's Reviews
            </h3>

            <p className="text-4xl font-bold mt-3 text-orange-600">
              {stats.todayReviews}
            </p>
          </div>

        </div>

        {/* Upload + AI Review */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* Upload Card */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              Upload Source Code
            </h2>

            <input
              type="file"
              onChange={(e) =>
                setSelectedFile(e.target.files[0])
              }
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg"
            >
              {loading
                ? "Reviewing with AI..."
                : "Review with AI"}
            </button>

          </div>

          {/* AI Review */}
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              AI Review
            </h2>

            {review ? (
              <>
                <p>
                  <b>File :</b> {review.fileName}
                </p>

                <p className="mt-2">
                  <b>Language :</b> {review.language}
                </p>

                <p className="mt-2">
                  <b>Score :</b> {review.score}
                </p>

                <div className="mt-4 bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">

                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {review.aiReview}
                    </ReactMarkdown>
                  </div>

                </div>
              </>
            ) : (
              <p className="text-gray-500">
                Upload a file to get AI Review.
              </p>
            )}

          </div>

       {review && (
  <button
    onClick={downloadPdf}
    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg mt-6"
  >
    Download PDF
  </button>
)}

        </div>

                {/* GitHub Repository Review */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            GitHub Repository Review
          </h2>

          <input
            type="text"
            placeholder="https://github.com/owner/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <button
            onClick={handleGithubReview}
            disabled={githubLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {githubLoading
              ? "Reviewing Repository..."
              : "Review Repository"}
          </button>

          {/* Repository Summary */}

          {repositorySummary && (

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">

              <h3 className="text-2xl font-bold text-blue-700 mb-4">
                Repository Summary
              </h3>

              <div className="prose prose-slate max-w-none">

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {repositorySummary}
                </ReactMarkdown>

              </div>

            </div>

          )}

          {/* Review Results */}

          {githubReviews.length > 0 && (

            <div className="mt-8">

              <h3 className="text-2xl font-bold mb-6">
                Review Results
              </h3>

              {githubReviews.map((review, index) => (

                <div
                  key={index}
                  className="bg-slate-50 border rounded-xl p-6 mb-6"
                >

                  <h4 className="text-xl font-bold">
                    {review.fileName}
                  </h4>

                  <p className="text-gray-600 mt-2">
                    <b>Language:</b> {review.language}
                  </p>

                  <div className="mt-5 prose prose-slate max-w-none">

                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {review.aiReview}
                    </ReactMarkdown>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Review History */}

        <ReviewHistory />

      </div>
    </div>
  );
};

export default Dashboard;