import { NavLink } from "react-router-dom";

const SubItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm transition
        ${isActive
          ? "bg-orange-50 text-orange-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"}`
      }
    >
      {label}
    </NavLink>
  );
};

export default SubItem;
