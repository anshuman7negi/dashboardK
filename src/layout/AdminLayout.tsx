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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">

      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Sidebar ================= */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72
        bg-white/80 backdrop-blur-xl
        border-r border-gray-200/50
        shadow-2xl
        z-50 transform transition-transform duration-300
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Krowdless Ops
          </h1>

          <button
            className="md:hidden text-gray-500 hover:text-black transition"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">

          {role === "ROLE_ADMIN" && (
            <SidebarItem
              to="/admin"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
          )}

          {/* Manage Roles */}
          {role === "ROLE_ADMIN" && (
            <DropdownMenu
              label="Manage Roles"
              icon={<Shield size={18} />}
              isOpen={openMenu === "roles"}
              toggle={() => toggleMenu("roles")}
            >
              <SubItem to="/admin/create-role" label="Create Role" />
              <SubItem to="/admin/create-permission" label="Create Permission" />
              <SubItem to="/admin/user-role-map" label="User Role Mapping" />
              <SubItem to="/admin/role-permission-map" label="Role Permission Mapping" />
            </DropdownMenu>
          )}

          {/* Destinations */}
          <DropdownMenu
            label="Manage Destinations"
            icon={<Globe size={18} />}
            isOpen={openMenu === "dest"}
            toggle={() => toggleMenu("dest")}
          >
            <SubItem to="/admin/create-destination" label="Create Destination" />
            <SubItem to="/admin/approve-reject-destination" label="Destination Moderation" />
            <SubItem to="/admin/add-destination-category" label="Destination Category" />
          </DropdownMenu>

          {/* States */}
          <DropdownMenu
            label="Manage States"
            icon={<MapPinned size={18} />}
            isOpen={openMenu === "states"}
            toggle={() => toggleMenu("states")}
          >
            <SubItem to="/admin/create-state" label="Create State" />
            <SubItem to="/admin/states" label="States" />
          </DropdownMenu>

          {/* Countries */}
          <DropdownMenu
            label="Manage Countries"
            icon={<MapPinned size={18} />}
            isOpen={openMenu === "countries"}
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
        <div className="p-5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
            text-red-600 hover:bg-red-50
            hover:scale-[1.02]
            transition-all duration-200 font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main Section ================= */}
      <div className="flex-1 flex flex-col md:ml-72">

        {/* Header */}
        <header className="sticky top-0 z-30
          bg-white/80 backdrop-blur-lg
          border-b border-gray-200/60
          px-8 py-4 flex items-center justify-between
          shadow-sm">

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-600 hover:text-black transition"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <h2 className="font-semibold text-lg tracking-tight text-gray-800">
              Admin Dashboard
            </h2>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            Admin User
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[calc(100vh-140px)]">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;