import { NavLink } from "react-router-dom";

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
          : "hover:bg-gray-100 text-gray-700"}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
