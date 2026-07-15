import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../../api/reviewApi";

const ReviewHistory = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setReviews(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">
        Review History
      </h2>

      {/* Search & Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search file..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-lg p-3"
        />

        <select
          value={language}
          onChange={(e) => {
            setPage(1);
            setLanguage(e.target.value);
          }}
          className="border rounded-lg p-3"
        >
          <option value="">All Languages</option>
          <option value="js">JavaScript</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setPage(1);
            setSort(e.target.value);
          }}
          className="border rounded-lg p-3"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="score">Highest Score</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews found.
        </p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">File</th>
                <th className="text-left py-3">Language</th>
                <th className="text-left py-3">Score</th>
                <th className="text-left py-3">Created</th>
                <th className="text-center py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3">
                    {review.fileName}
                  </td>

                  <td>{review.language}</td>

                  <td>{review.score}</td>

                  <td>
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/reviews/${review._id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <p>
              Page {pagination.currentPage} of{" "}
              {pagination.totalPages}
            </p>

            <button
              disabled={
                page === pagination.totalPages
              }
              onClick={() => setPage(page + 1)}
              className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
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