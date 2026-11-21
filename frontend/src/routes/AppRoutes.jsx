import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import UploadPage from "../pages/upload/UploadPage";
import GithubReview from "../pages/github/GithubReview";

import ReviewHistory from "../components/reviews/ReviewHistory";
import ReviewDetails from "../pages/review/ReviewDetails";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

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

          <Route
            path="/reviews/:id"
            element={<ReviewDetails />}
          />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;