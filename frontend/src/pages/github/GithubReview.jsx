import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../api/api";
import { downloadReviewPDF } from "../../utils/pdfExport";

const GithubReview = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleReview = async () => {
    if (!repoUrl.trim()) {
      return alert("Please enter a GitHub repository URL.");
    }

    try {
      setLoading(true);

      const response = await api.post("/github/review", {
        repoUrl,
      });

      console.log("Response =", response.data);

      setResult(response.data.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Repository review failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold">
          GitHub Repository Review
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Paste any public GitHub repository URL and let AI review the project.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="https://github.com/user/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3"
          />

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
          >
            {loading ? "Reviewing..." : "Review Repository"}
          </button>
        </div>

        {result && (
          <>
            <div className="mt-10 bg-blue-50 border rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-5">
                Repository Information
              </h2>

              <p><b>Repository :</b> {result.repository?.name}</p>

              <p><b>Description :</b> {result.repository?.description}</p>

              <p><b>Language :</b> {result.repository?.language}</p>

              <p><b>Stars :</b> ⭐ {result.repository?.stars}</p>

              <p><b>Forks :</b> 🍴 {result.repository?.forks}</p>

              <p><b>Issues :</b> {result.repository?.issues}</p>

              <p><b>Total Files :</b> {result.totalFiles}</p>

              <p><b>Reviewed Files :</b> {result.reviewedFiles}</p>

              <div className="mt-6 prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.repositorySummary}
                </ReactMarkdown>
              </div>

             <button
  onClick={() =>
    downloadReviewPDF(
      result.repository,
      result.summary
    )
  }
  className="bg-green-600 text-white px-5 py-2 rounded-lg mt-5 hover:bg-green-700"
>
  Download PDF
</button>


            </div>

            <div className="mt-8">

              <h2 className="text-2xl font-bold mb-5">
                File Reviews
              </h2>

              {(result.reviews || []).length === 0 ? (

                <div className="bg-yellow-100 border rounded-lg p-5">
                  No file reviews returned from backend.
                </div>

              ) : (

                <div className="space-y-6">

                  {(result.reviews || []).map((review, index) => (

                    <div
                      key={index}
                      className="border rounded-xl p-6 bg-white shadow"
                    >

                      <h3 className="font-bold text-xl">
                        {review.fileName}
                      </h3>

                      <p className="text-gray-500">
                        {review.language}
                      </p>

                      <div className="mt-4 prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {review.aiReview}
                        </ReactMarkdown>
                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default GithubReview;