import jsPDF from "jspdf";

// Dashboard PDF
export const exportToPDF = (stats) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Code Review Assistant", 20, 20);

  doc.setFontSize(14);
  doc.text("Dashboard Report", 20, 35);

  doc.setFontSize(12);

  doc.text(`Total Reviews : ${stats.totalReviews}`, 20, 55);
  doc.text(`Average Score : ${stats.averageScore}/100`, 20, 65);
  doc.text(`Languages : ${stats.languages}`, 20, 75);
  doc.text(`Recent Reviews : ${stats.recentReviews}`, 20, 85);

  doc.save("Dashboard-Report.pdf");
};

// GitHub Repository PDF
export const downloadReviewPDF = (repository, summary) => {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("AI GitHub Repository Review", 20, y);

  y += 15;

  doc.setFontSize(12);

  doc.text(`Repository : ${repository.name}`, 20, y);
  y += 10;

  doc.text(`Language : ${repository.language}`, 20, y);
  y += 10;

  doc.text(`Stars : ${repository.stars}`, 20, y);
  y += 10;

  doc.text(`Forks : ${repository.forks}`, 20, y);
  y += 10;

  doc.text(`Issues : ${repository.issues}`, 20, y);
  y += 15;

  doc.setFontSize(15);
  doc.text("Repository Summary", 20, y);

  y += 10;

  doc.setFontSize(11);

  const lines = doc.splitTextToSize(summary, 170);

  doc.text(lines, 20, y);

  doc.save("Repository-Review.pdf");
};