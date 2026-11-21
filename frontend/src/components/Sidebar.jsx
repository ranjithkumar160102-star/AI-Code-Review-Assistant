import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Upload Review",
      path: "/upload",
      icon: "📂",
    },
    {
      name: "GitHub Review",
      path: "/github",
      icon: "🐙",
    },
    {
      name: "Review History",
      path: "/history",
      icon: "📜",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen shadow-lg">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          AI Code Review
        </h1>

        <p className="text-sm text-slate-400 mt-2">
          Assistant
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 text-xs text-slate-500">
        Version 1.0
      </div>
    </aside>
  );
};

export default Sidebar;