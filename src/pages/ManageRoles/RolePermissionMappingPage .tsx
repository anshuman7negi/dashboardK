import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import {
  getAllRoles,
  getAllPermissions,
  getRolePermissions,
  updateRolePermissions,
  type RoleDto,
  type PermissionDto,
} from "../../services/RoleService";

const RolePermissionMappingPage = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const loadData = async () => {
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
    loadData();
  }, []);

  /* ================= LOAD ROLE PERMISSIONS ================= */
  useEffect(() => {
    if (!selectedRole) return;

    const fetchRolePerms = async () => {
      try {
        setRoleLoading(true);
        const data = await getRolePermissions(selectedRole);
        const ids = data.map((p) => p.id);
        setSelectedPermissions(ids);
        setOriginalPermissions(ids);
      } catch {
        toast.error("Failed to fetch role permissions");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRolePerms();
  }, [selectedRole]);

  const handleCheckboxChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const hasChanges =
    JSON.stringify([...selectedPermissions].sort()) !==
    JSON.stringify([...originalPermissions].sort());

  const handleSave = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      await updateRolePermissions(selectedRole, selectedPermissions);
      setOriginalPermissions(selectedPermissions);
      toast.success("Permissions updated successfully 🎉");
    } catch {
      toast.error("Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-12">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Role Permission Mapping
          </h1>
          <p className="text-gray-500 mt-3">
            Manage access control with precision
          </p>
        </div>

        {/* ROLE CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-8 mb-10 transition-all">

          <label className="text-sm font-semibold text-gray-600">
            Select Role
          </label>

          <select
            value={selectedRole ?? ""}
            onChange={(e) => setSelectedRole(Number(e.target.value))}
            className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISSION CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10 transition-all">

          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Permissions
          </h2>

          {/* Skeleton */}
          {(loading || roleLoading) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Permission List */}
          {!loading && !roleLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[420px] overflow-y-auto pr-2">

              {permissions.map((permission) => {
                const isChecked = selectedPermissions.includes(permission.id);

                return (
                  <label
                    key={permission.id}
                    className={`group flex items-center justify-between px-6 py-4 rounded-xl border cursor-pointer transition-all duration-300
                    ${
                      isChecked
                        ? "border-green-400 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleCheckboxChange(permission.id)
                        }
                        className="w-5 h-5 accent-green-500"
                      />
                      <span className="font-medium text-gray-700">
                        {permission.name}
                      </span>
                    </div>

                    {isChecked && (
                      <CheckCircle2
                        size={20}
                        className="text-green-500 transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${
                !hasChanges
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:scale-105 hover:shadow-xl"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RolePermissionMappingPage;
