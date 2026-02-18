import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  DollarSign,
  Menu,
  MapPinned,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import SidebarItem from "../components/sidebar/SidebarItem";
import DropdownMenu from "../components/sidebar/DropdownMenu";
import SubItem from "../components/sidebar/SubItem";


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");


  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r z-50 transform transition-transform duration-300 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-orange-500">
            Krowdless Ops
          </h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">

          {role === "ROLE_ADMIN" && (
            <SidebarItem
              to="/admin"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
          )}


          {/* MANAGE ROLES DROPDOWN */}
          {role === "ROLE_ADMIN" && (
            <DropdownMenu
              label="Manage Roles"
              icon={<Shield size={18} />}
              isOpen={openMenus.includes("roles")}
              toggle={() => toggleMenu("roles")}
            >
              <SubItem to="/admin/create-role" label="Create Role" />
              <SubItem to="/admin/create-permission" label="Create Permission" />
              <SubItem to="/admin/user-role-map" label="User Role Mapping" />
              <SubItem to="/admin/role-permission-map" label="Role Permission Mapping" />
            </DropdownMenu>
          )}


          {/* DESTINATIONS */}
          <DropdownMenu
            label="Destinations"
            icon={<Globe size={18} />}
            isOpen={openMenus.includes("dest")}
            toggle={() => toggleMenu("dest")}
          >
            <SubItem to="/admin/create-destination" label="Create Destination" />
            <SubItem to="/admin/add-destination" label="Add Destination" />
          </DropdownMenu>

          {/* STATES */}
          <DropdownMenu
            label="States"
            icon={<MapPinned size={18} />}
            isOpen={openMenus.includes("states")}
            toggle={() => toggleMenu("states")}
          >
            <SubItem to="/admin/create-state" label="Create State" />
            <SubItem to="/admin/states" label="States" />
          </DropdownMenu>

          {/* COUNTRIES */}
          <DropdownMenu
            label="Countries"
            icon={<MapPinned size={18} />}
            isOpen={openMenus.includes("countries")}
            toggle={() => toggleMenu("countries")}
          >
            <SubItem to="/admin/create-country" label="Create Country" />
          </DropdownMenu>

          {role === "ROLE_ADMIN" && (
            <SidebarItem
              to="/admin/revenue"
              icon={<DollarSign size={18} />}
              label="Revenue"
            />
          )}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
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
      <div className="flex-1 flex flex-col md:ml-64">

        {/* Header */}
        <header className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
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

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
