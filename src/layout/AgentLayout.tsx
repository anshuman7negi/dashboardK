import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  Menu,
  ClipboardList,
} from "lucide-react";

const AgentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes("packages")) return "Packages";
    if (location.pathname.includes("bookings")) return "Bookings";
    if (location.pathname.includes("employees")) return "Employees";
    if (location.pathname.includes("revenue")) return "Revenue";
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-gray-200
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Agent Panel
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-2">

          <SidebarItem
            to="/agent"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
          />

          <SidebarItem
            to="/agent/packages"
            icon={<Package size={18} />}
            label="Packages"
            collapsed={collapsed}
          />

          <SidebarItem
            to="/agent/bookings"
            icon={<ClipboardList size={18} />}
            label="Bookings"
            collapsed={collapsed}
          />

          <SidebarItem
            to="/agent/employees"
            icon={<Users size={18} />}
            label="Employees"
            collapsed={collapsed}
          />

          <SidebarItem
            to="/agent/revenue"
            icon={<DollarSign size={18} />}
            label="Revenue"
            collapsed={collapsed}
          />

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">
            {getPageTitle()}
          </h2>

          <div className="text-sm text-gray-500">
            Agent User
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AgentLayout;

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarItem = ({
  to,
  icon,
  label,
  collapsed,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${isActive
          ? "bg-blue-100 text-blue-600 font-medium"
          : "hover:bg-gray-100 text-gray-700"
        }`
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};
