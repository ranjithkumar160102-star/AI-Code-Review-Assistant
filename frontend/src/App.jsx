import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import UploadPage from "./pages/upload/UploadPage";
import GithubReview from "./pages/github/GithubReview";
import ReviewDetails from "./pages/review/ReviewDetails";

import ReviewHistory from "./components/reviews/ReviewHistory";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<UploadPage />} />

        <Route path="/github" element={<GithubReview />} />

        <Route path="/history" element={<ReviewHistory />} />

        <Route path="/reviews/:id" element={<ReviewDetails />} />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;