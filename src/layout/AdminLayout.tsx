import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Globe,
  DollarSign,
  Menu,
  MapPinned,
} from "lucide-react";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

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
            <h1 className="text-xl font-bold text-orange-500">
              Krowdless Ops
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-2">
          <SidebarItem
            to="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/users"
            icon={<Users size={18} />}
            label="Users"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/destinations"
            icon={<Globe size={18} />}
            label="Destinations"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/states"
            icon={<MapPinned size={18} />}
            label="States"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/countries"
            icon={<MapPinned size={18} />}
            label="Countries"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/revenue"
            icon={<DollarSign size={18} />}
            label="Revenue"
            collapsed={collapsed}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex justify-between">
          <h2 className="font-semibold">Admin Dashboard</h2>
          <div className="text-sm text-gray-500">Admin User</div>
        </header>

        <main className="flex-1 p-6">
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
          ? "bg-orange-100 text-orange-600 font-medium"
          : "hover:bg-gray-100 text-gray-700"
        }`
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};
