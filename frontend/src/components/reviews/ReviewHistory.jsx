import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews, deleteReview } from "../../api/reviewApi";

const ReviewHistory = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    loadReviews();
  }, [search, language, sort, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const res = await getReviews(
        search,
        language,
        sort,
        page,
        5
      );

      console.log("FULL RESPONSE:", res);
      console.log("REVIEWS:", res.data);

      setReviews(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error(error);
      alert("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      setDeletingId(id);

      await deleteReview(id);

      loadReviews();
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90)
      return "bg-green-100 text-green-700";

    if (score >= 75)
      return "bg-blue-100 text-blue-700";

    if (score >= 50)
      return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Review History
          </h2>

          <p className="text-gray-500">
            Total Reviews : {pagination.total}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-3"
        />

        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-3"
        >
          <option value="">All Languages</option>
          <option value="js">JavaScript</option>
          <option value="jsx">React JSX</option>
          <option value="ts">TypeScript</option>
          <option value="tsx">React TSX</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg p-3"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="score-high">Highest Score</option>
          <option value="score-low">Lowest Score</option>
        </select>

      </div>

      {reviews.length === 0 ? (

        <div className="text-center py-10">
          No Reviews Found
        </div>

      ) : (

        <>
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-100">

                  <th className="p-3 text-left">
                    Repository
                  </th>

                  <th className="p-3 text-left">
                    Language
                  </th>

                  <th className="p-3 text-left">
                    Score
                  </th>

                  <th className="p-3 text-left">
                    Date
                  </th>

                  <th className="p-3 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {reviews.map((review) => {

                  console.log(review);

                  const firstFile = review.reviews?.[0];

                  return (

                    <tr
                      key={review._id}
                      className="border-b"
                    >

                      <td className="p-3">
                        {review.repoUrl
                          ? review.repoUrl.split("/").pop()
                          : "Repository"}
                      </td>

                      <td className="p-3">
                        {firstFile?.language || "-"}
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded ${getScoreColor(
                            firstFile?.score || 0
                          )}`}
                        >
                          {firstFile?.score || 0}/100
                        </span>

                      </td>

                      <td className="p-3">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3">

                        <div className="flex gap-2 justify-center">

                          <button
                            onClick={() =>
                              navigate(
                                `/reviews/${review._id}`
                              )
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(review._id)
                            }
                            disabled={
                              deletingId === review._id
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded"
                          >
                            {deletingId === review._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

          <div className="flex justify-between items-center mt-8">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
              className="bg-gray-700 text-white px-5 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <div>
              Page {pagination.currentPage} of{" "}
              {pagination.totalPages}
            </div>

            <button
              disabled={
                page >= pagination.totalPages
              }
              onClick={() =>
                setPage(page + 1)
              }
              className="bg-gray-700 text-white px-5 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </>

      )}

    </div>
  );
};

export default ReviewHistory;