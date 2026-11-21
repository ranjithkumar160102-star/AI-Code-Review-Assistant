import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;