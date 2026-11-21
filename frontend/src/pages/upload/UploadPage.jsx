import { useState } from "react";
import { uploadFile } from "../../api/uploadApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadFile(formData);

      setReview(res.data);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "File review failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyReview = async () => {
    await navigator.clipboard.writeText(
      review.aiReview
    );

    alert("Review copied.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-xl shadow-lg p-8">

          <h1 className="text-3xl font-bold mb-2">
            AI File Review
          </h1>

          <p className="text-gray-500 mb-8">
            Upload your source code file and receive
            an AI-powered code review.
          </p>

          <div className="border-2 border-dashed rounded-xl p-10 text-center">

            <input
              type="file"
              onChange={handleFileChange}
              className="mb-5"
            />

            {file && (
              <div className="mb-5">

                <p>
                  <b>Selected File:</b>
                </p>

                <p>{file.name}</p>

                <p className="text-gray-500 text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </p>

              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg disabled:bg-gray-400"
            >
              {loading
                ? "Reviewing..."
                : "Upload & Review"}
            </button>

          </div>

          {review && (
            <div className="mt-10">

              <hr className="mb-8" />

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">
                    Review Result
                  </h2>

                  <p className="mt-2">
                    <b>File:</b> {review.fileName}
                  </p>

                  <p>
                    <b>Language:</b>{" "}
                    {review.language}
                  </p>

                  <p>
                    <b>Score:</b>{" "}
                    {review.score}/100
                  </p>

                </div>

                <button
                  onClick={copyReview}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                  Copy Review
                </button>

              </div>

              <div className="mt-8 bg-slate-50 rounded-xl p-6">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                >
                  {review.aiReview}
                </ReactMarkdown>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UploadPage;