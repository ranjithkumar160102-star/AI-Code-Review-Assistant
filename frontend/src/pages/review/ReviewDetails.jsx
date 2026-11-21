import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReview } from "../../api/reviewApi";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const res = await getReview(id);

      setReview(res.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load review.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        Loading...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center mt-20">
        Review Not Found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-8">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Review Details
      </h1>

      <div className="space-y-5">

        <div>
          <h3 className="font-semibold">Repository</h3>
          <p>{review.repoUrl || "-"}</p>
        </div>

        <div>
          <h3 className="font-semibold">Summary</h3>
          <p>{review.repositorySummary}</p>
        </div>

        <div>
          <h3 className="font-semibold">Reviewed Files</h3>
          <p>
            {review.reviewedFiles} / {review.totalFiles}
          </p>
        </div>

      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-5">
        File Reviews
      </h2>

      {review.reviews.length === 0 ? (
        <p>No file reviews.</p>
      ) : (
        review.reviews.map((file, index) => (
          <div
            key={index}
            className="border rounded-lg p-5 mb-5"
          >
            <h3 className="font-bold text-lg">
              {file.fileName}
            </h3>

            <p className="mt-2">
              <b>Language :</b> {file.language}
            </p>

            <p className="mt-2">
              <b>Score :</b> {file.score}/100
            </p>

            <div className="mt-4">
              <h4 className="font-semibold">
                AI Review
              </h4>

              <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
                {file.aiReview}
              </pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewDetails;