import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import jsPDF from "jspdf";

import { getReview, deleteReview } from "../../api/reviewApi";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const response = await getReview(id);
      setReview(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load review");
    } finally {
      setLoading(false);
    }
  };

const copySourceCode = async () => {
  try {
    await navigator.clipboard.writeText(review.sourceCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (error) {
    alert("Copy failed");
  }
};

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Code Review Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`File: ${review.fileName}`, 20, 40);
  doc.text(`Language: ${review.language}`, 20, 50);
  doc.text(`Score: ${review.score}/100`, 20, 60);

  const reviewText = doc.splitTextToSize(
    review.aiReview,
    170
  );

  doc.text(reviewText, 20, 80);

  doc.save(`${review.fileName}-review.pdf`);
};

const downloadMarkdown = () => {
  const markdown = `# AI Code Review Report

## File
${review.fileName}

## Language
${review.language}

## Score
${review.score}/100

## Original Source Code

\`\`\`${review.language}
${review.sourceCode}
\`\`\`

## AI Review

${review.aiReview}
`;

  const blob = new Blob([markdown], {
    type: "text/markdown",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${review.fileName}-review.md`;

  link.click();

  window.URL.revokeObjectURL(url);
};

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await deleteReview(id);

      alert("Review deleted successfully");

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-10 text-center">
        Review not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate("/dashboard")}
          className="mb-5 bg-gray-800 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow p-8">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold">
                {review.fileName}
              </h1>

              <p className="mt-3">
                <b>Language:</b> {review.language}
              </p>

              <p className="mt-2">
                <b>Score:</b> {review.score}/100
              </p>
            </div>

           <div className="flex gap-3">
  <button
    onClick={downloadPDF}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
  >
    📄 Download PDF
  </button>

  <button
    onClick={downloadMarkdown}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
  >
    📝 Download MD
  </button>

  <button
    onClick={handleDelete}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
  >
    Delete Review
  </button>
</div>

          </div>

          <hr className="my-6" />

        <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">
    Original Source Code
  </h2>

  <button
    onClick={copySourceCode}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
  >
    {copied ? " Copied" : " Copy"}
  </button>
</div>

<pre
  style={{
    background: "#282c34",
    color: "#fff",
    padding: "20px",
    borderRadius: "10px",
    overflowX: "auto",
  }}
>
  <code>{review.sourceCode}</code>
</pre>

<hr className="my-8" />

<h2 className="text-2xl font-bold mb-4">
  AI Review
</h2>

          <article className="max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");

        if (!inline && match) {
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }

        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {review.aiReview}
  </ReactMarkdown>
</article>

        </div>

      </div>

    </div>
  );
};

export default ReviewDetails;