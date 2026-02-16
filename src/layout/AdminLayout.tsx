import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Globe,
  DollarSign,
  Menu,
  MapPinned,
  LogOut,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed md:fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
    z-50 transform transition-transform duration-300 flex flex-col
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >

        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h1 className="text-xl font-bold text-orange-500">
            Krowdless Ops
          </h1>

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          <SidebarItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarItem to="/admin/users" icon={<Users size={18} />} label="Users" />
          <SidebarItem to="/admin/destinations" icon={<Globe size={18} />} label="Destinations" />
          <SidebarItem to="/admin/states" icon={<MapPinned size={18} />} label="States" />
          <SidebarItem to="/admin/countries" icon={<MapPinned size={18} />} label="Countries" />
          <SidebarItem to="/admin/revenue" icon={<DollarSign size={18} />} label="Revenue" />
        </nav>

        {/* Logout fixed bottom */}
        <div className="p-4 border-t shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">

        {/* Header */}
        <header className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <h2 className="font-semibold text-gray-800">
              Admin Dashboard
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            Admin User
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ to, icon, label }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${isActive
          ? "bg-orange-100 text-orange-600 font-medium"
          : "hover:bg-gray-100 text-gray-700"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
