import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";

import { getAdminUsers, type AdminUserDto } from "../../services/adminUserApi";
import { useNavigate } from "react-router-dom";

const ManageUsersPage = () => {
  const [users, setUsers] = useState<AdminUserDto[]>([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAdminUsers(page, size, search);

      setUsers(data?.content || []);
      setTotalUsers(data?.totalElements || 0);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  /* ================= SEARCH ================= */

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  /* ================= PAGE ================= */

  const goToPreviousPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  /* ================= PAGE NUMBERS ================= */

  const getPageNumbers = () => {
    const pages: number[] = [];

    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 px-6 py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* ================= WATERMARK ================= */}

      <div className="absolute inset-0 rotate-[-25deg] opacity-10 text-orange-600 font-extrabold pointer-events-none select-none flex flex-wrap justify-center items-center gap-24 text-[90px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>

          <p className="text-gray-500 mt-2">
            View and manage all registered users
          </p>
        </div>

        {/* ================= TOTAL USERS CARD ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>

                {loading ? (
                  <div className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse mt-2" />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {totalUsers.toLocaleString()}
                  </h2>
                )}
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Users size={24} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="relative max-w-xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by fullname or username..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>

          {search && (
            <p className="text-sm text-gray-500 mt-3">
              Searching for:{" "}
              <span className="font-medium text-gray-700">{search}</span>
            </p>
          )}
        </div>

        {/* ================= USERS TABLE ================= */}

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>

            <p className="text-sm text-gray-500 mt-1">
              {totalUsers.toLocaleString()} registered users
            </p>
          </div>

          {/* ================= LOADING ================= */}

          {loading ? (
            <div className="p-8">
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            /* ================= EMPTY ================= */

            <div className="p-16 text-center">
              <Users size={48} className="mx-auto text-gray-300" />

              <h3 className="text-lg font-semibold text-gray-700 mt-4">
                No users found
              </h3>

              <p className="text-gray-500 mt-2">
                Try searching with a different fullname or username.
              </p>
            </div>
          ) : (
            /* ================= TABLE ================= */

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-8 py-4 text-sm font-semibold text-gray-600">
                      Full Name
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Username
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-orange-50/40 transition"
                    >
                      {/* FULL NAME */}

                      <td
                        className="px-5 py-3 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/manage-users/${user.id}`)
                        }
                      >
                        <p className="font-medium text-gray-800 hover:text-orange-600 transition">
                          {user.fullname || "N/A"}
                        </p>
                      </td>

                      {/* USERNAME */}

                      <td className="px-6 py-5">
                        <span className="text-gray-700">@{user.username}</span>
                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-5">
                        <span className="text-gray-600">{user.email}</span>
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {user.roles?.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role}
                                className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
                              >
                                {role.replace("ROLE_", "")}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No Role
                            </span>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= PAGINATION ================= */}

          {!loading && users.length > 0 && totalPages > 1 && (
            <div className="px-8 py-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {page * size + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min((page + 1) * size, totalUsers)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalUsers}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-2">
                {/* PREVIOUS */}

                <button
                  onClick={goToPreviousPage}
                  disabled={page === 0}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* PAGE NUMBERS */}

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}
                </div>

                {/* NEXT */}

                <button
                  onClick={goToNextPage}
                  disabled={page === totalPages - 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
