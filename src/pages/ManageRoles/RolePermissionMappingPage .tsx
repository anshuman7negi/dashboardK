import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllRoles,
  getAllPermissions,
  assignPermissionToRole,
  getRolePermissions,
  type RoleDto,
  type PermissionDto,
} from "../../services/RoleService";
import { Check } from "lucide-react";

const RolePermissionMappingPage = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [assignedPermissions, setAssignedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  /* ================= INIT LOAD ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const [roleData, permData] = await Promise.all([
          getAllRoles(),
          getAllPermissions(),
        ]);
        setRoles(roleData);
        setPermissions(permData);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* ================= FETCH ROLE PERMISSIONS ================= */
  useEffect(() => {
    if (!selectedRole) return;

    const fetchRolePerms = async () => {
      try {
        const data = await getRolePermissions(selectedRole);
        setAssignedPermissions(data.map((p) => p.id));
      } catch {
        toast.error("Failed to fetch role permissions");
      }
    };

    fetchRolePerms();
  }, [selectedRole]);

  /* ================= TOGGLE ================= */
  const handleToggle = async (permissionId: number) => {
    if (!selectedRole) {
      toast.error("Select a role first");
      return;
    }

    // Instant UI update (no lag feel)
    const isAlreadyAssigned = assignedPermissions.includes(permissionId);

    setAssignedPermissions((prev) =>
      isAlreadyAssigned
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );

    try {
      setUpdatingId(permissionId);
      await assignPermissionToRole(selectedRole, permissionId);
    } catch {
      toast.error("Failed to update permission");
      // rollback if API fails
      setAssignedPermissions((prev) =>
        isAlreadyAssigned
          ? [...prev, permissionId]
          : prev.filter((id) => id !== permissionId)
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 px-6 py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* Watermark */}
      <div className="absolute inset-0 rotate-[-25deg] opacity-10 text-orange-600 font-extrabold pointer-events-none select-none flex flex-wrap justify-center items-center gap-24 text-[90px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800">
            Role Permission Mapping
          </h1>
          <p className="text-gray-500 mt-2">
            Assign permissions to selected role
          </p>
        </div>

        {/* ROLE SELECT (TOP FULL WIDTH) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">

          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Select Role
          </h2>

          <select
            value={selectedRole ?? ""}
            onChange={(e) =>
              setSelectedRole(Number(e.target.value))
            }
            className="w-full border border-gray-300 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none transition"
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

        </div>

        {/* PERMISSIONS CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-10">

          <h2 className="text-lg font-semibold mb-8 text-gray-800">
            Permissions
          </h2>

          <div className="max-h-[450px] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Skeleton */}
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}

            {/* Permission List */}
            {!loading &&
              permissions.map((permission) => {
                const isAssigned =
                  assignedPermissions.includes(permission.id);

                return (
                  <div
                    key={permission.id}
                    onClick={() => handleToggle(permission.id)}
                    className={`cursor-pointer px-6 py-4 rounded-2xl border transition-all duration-200 flex items-center justify-between
                    ${
                      isAssigned
                        ? "bg-orange-50 border-orange-400 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium text-gray-700">
                      {permission.name}
                    </span>

                    {updatingId === permission.id ? (
                      <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isAssigned && (
                        <Check
                          size={18}
                          className="text-orange-500"
                        />
                      )
                    )}
                  </div>
                );
              })}

          </div>
        </div>

      </div>
    </div>
  );
};

export default RolePermissionMappingPage;
