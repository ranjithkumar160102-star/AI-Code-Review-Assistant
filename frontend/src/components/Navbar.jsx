import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          AI Code Review Assistant
        </h2>

        <p className="text-sm text-gray-500">
          Analyze • Review • Improve
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <h3 className="font-semibold text-slate-800">
            {user?.name || "Developer"}
          </h3>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "D"}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;