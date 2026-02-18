import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createRole,
  getAllRoles,
  deleteRole,
  type RoleDto,
} from "../../services/RoleService";
import { Trash2, X } from "lucide-react";

const CreateRolePage = () => {
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch {
      toast.error("Failed to load roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /* ================= CREATE ROLE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");

    if (!roleName.trim()) {
      setFieldError("Role name is required");
      return;
    }

    try {
      setLoading(true);

      await createRole({
        name: roleName.trim().toUpperCase(),
      });

      toast.success("Role created successfully 🚀");
      setRoleName("");
      fetchRoles();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create role"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteModalId) return;

    try {
      setDeletingId(deleteModalId);
      await deleteRole(deleteModalId);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete role"
      );
    } finally {
      setDeletingId(null);
      setDeleteModalId(null);
    }
  };

  return (
    <div className="min-h-screen -mt-6 -mx-6 px-6 py-12 bg-gray-100 relative">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Role Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create, view and manage system roles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Create Role
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Role Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. ROLE_MANAGER"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className={`w-full border px-4 py-3 rounded-xl focus:ring-2 outline-none transition
                  ${
                    fieldError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
                />

                {fieldError && (
                  <p className="text-red-500 text-sm mt-2">
                    {fieldError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-[1.02] transition shadow-md disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Role"}
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Existing Roles
            </h2>

            {roles.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No roles found.
              </p>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">

                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-700">
                      {role.name}
                    </span>

                    <button
                      onClick={() => setDeleteModalId(role.id)}
                      disabled={deletingId === role.id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {deleteModalId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Delete
              </h3>
              <button onClick={() => setDeleteModalId(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this role?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRolePage;
