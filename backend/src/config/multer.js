import multer from "multer";
import fs from "fs";
import path from "path";

// Upload Folder
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allowed File Types
const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".cpp",
  ".c",
  ".cs",
  ".php",
  ".go",
  ".rb",
  ".txt",
  ".json",
  ".html",
  ".css",
  ".md",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Please upload a valid source code file."
      ),
      false
    );
  }
};

// Multer Config
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;