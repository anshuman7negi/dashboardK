import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createPermission,
  getAllPermissions,
  deletePermission,
  type PermissionDto,
} from "../../services/RoleService";
import { Trash2, X } from "lucide-react";

const CreatePermissionPage = () => {
  const [permissionName, setPermissionName] = useState("");
  const [permissions, setPermissions] = useState<PermissionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fieldError, setFieldError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  /* FETCH */
  const fetchPermissions = async () => {
    try {
      setFetching(true);
      const data = await getAllPermissions();
      setPermissions(data);
    } catch {
      toast.error("Failed to load permissions");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  /* CREATE */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");

    if (!permissionName.trim()) {
      setFieldError("Permission name is required");
      return;
    }

    try {
      setLoading(true);
      await createPermission({
        name: permissionName.trim().toUpperCase(),
      });
      toast.success("Permission created successfully 🚀");
      setPermissionName("");
      fetchPermissions();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create permission"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    try {
      setDeletingId(deleteModalId);
      await deletePermission(deleteModalId);
      toast.success("Permission deleted");
      fetchPermissions();
    } catch (error: any) {
      toast.error("Failed to delete permission");
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
            Permission Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage system permissions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT FIXED HEIGHT */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200 h-[520px] flex flex-col justify-start">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Create Permission
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Permission Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. MANAGE_USERS"
                  value={permissionName}
                  onChange={(e) => setPermissionName(e.target.value)}
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
                {loading ? "Creating..." : "Create Permission"}
              </button>

            </form>
          </div>

          {/* RIGHT FIXED HEIGHT + SCROLL */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200 h-[520px] flex flex-col">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Existing Permissions
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">

              {/* SKELETON */}
              {fetching &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 rounded-xl bg-gray-200 animate-pulse"
                  />
                ))}

              {/* DATA */}
              {!fetching &&
                permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-700">
                      {permission.name}
                    </span>

                    <button
                      onClick={() => setDeleteModalId(permission.id)}
                      disabled={deletingId === permission.id}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {deleteModalId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Delete
              </h3>
              <button onClick={() => setDeleteModalId(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this permission?
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

export default CreatePermissionPage;
