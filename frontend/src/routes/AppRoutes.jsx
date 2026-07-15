import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import UploadReview from "../pages/review/UploadReview";
import ReviewHistory from "../pages/review/ReviewHistory";
import ReviewDetails from "../pages/review/ReviewDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Review */}
      <Route path="/upload" element={<UploadReview />} />
      <Route path="/history" element={<ReviewHistory />} />
      <Route path="/review/:id" element={<ReviewDetails />} />
    </Routes>
  );
};

export default AppRoutes;