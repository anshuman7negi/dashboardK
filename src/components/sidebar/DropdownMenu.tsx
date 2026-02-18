import { ChevronDown, ChevronRight } from "lucide-react";

interface DropdownMenuProps {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}

const DropdownMenu = ({
  label,
  icon,
  isOpen,
  toggle,
  children,
}: DropdownMenuProps) => {
  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
