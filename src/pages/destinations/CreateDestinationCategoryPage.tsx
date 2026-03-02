import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
  type CategoryDto,
} from "../../services/CategoryService";
import { Trash2, X } from "lucide-react";

const CreateDestinationCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= CREATE CATEGORY ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");

    if (!categoryName.trim()) {
      setFieldError("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: categoryName.trim(),
      });

      toast.success("Category created successfully 🚀");
      setCategoryName("");
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
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
      await deleteCategory(deleteModalId);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete category"
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
            Destination Category Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage destination categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Create Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Beach"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
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
                {loading ? "Creating..." : "Create Category"}
              </button>

            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">

            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              Existing Categories
            </h2>

            {categories.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No categories found.
              </p>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-700">
                      {category.name}
                    </span>

                    <button
                      onClick={() => setDeleteModalId(category.id)}
                      disabled={deletingId === category.id}
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
              Are you sure you want to delete this category?
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

export default CreateDestinationCategoryPage;