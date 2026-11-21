import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setError("");

    const response = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    login(
      response.data.user,
      response.data.token
    );

    navigate("/dashboard");
  } catch (err) {
    setError(
      err.response?.data?.message || "Login failed"
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">
          AI Code Review
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to continue
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;