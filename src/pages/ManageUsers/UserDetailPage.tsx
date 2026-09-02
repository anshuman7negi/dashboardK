import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Mail,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Save,
  Check,
} from "lucide-react";

import {
  getAdminUser,
  assignUserRoles,
  type AdminUserDto,
} from "../../services/adminUserApi";

import {
  getAllRoles,
  type RoleDto,
} from "../../services/RoleService";

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUserDto | null>(null);

  const [roles, setRoles] = useState<RoleDto[]>([]);

  // Multiple roles
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [savingRole, setSavingRole] = useState(false);

  /* ================= FETCH USER ================= */

  const fetchUser = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const data = await getAdminUser(Number(userId));

      setUser(data);

      // Existing roles ko selected rakho
      if (data?.roles) {
        setSelectedRoles(data.roles);
      } else {
        setSelectedRoles([]);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ROLES ================= */

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);

      const data = await getAllRoles();

      setRoles(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [userId]);

  /* ================= ROLE CHECK / UNCHECK ================= */

  const handleRoleChange = (roleName: string) => {
    setSelectedRoles((prev) => {

      if (prev.includes(roleName)) {
        // Remove role from selection
        return prev.filter(
          (role) => role !== roleName
        );
      }

      // Add role
      return [...prev, roleName];
    });
  };

  /* ================= ASSIGN ROLES ================= */

  const handleAssignRoles = async () => {
    if (!user) return;

    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    try {
      setSavingRole(true);

      await assignUserRoles(
        user.id,
        selectedRoles
      );

      toast.success(
        "Roles assigned successfully"
      );

      // Fresh data fetch
      await fetchUser();

    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to assign roles"
      );
    } finally {
      setSavingRole(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen -mt-6 -mx-6 px-6 py-12 bg-gray-100">

        <div className="max-w-5xl mx-auto">

          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">

            <div className="space-y-6">

              <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />

              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />

              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />

              <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* ================= USER NOT FOUND ================= */

  if (!user) {
    return (
      <div className="min-h-screen -mt-6 -mx-6 px-6 py-12 bg-gray-100">

        <div className="max-w-5xl mx-auto text-center">

          <h1 className="text-2xl font-bold text-gray-800">
            User not found
          </h1>

          <button
            onClick={() =>
              navigate("/admin/manage-users")
            }
            className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
          >
            Back to Users
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-6 -mx-6 px-6 py-10 bg-gradient-to-br from-orange-50 via-white to-pink-50">

      <div className="max-w-5xl mx-auto space-y-6">

        {/* ================= BACK ================= */}

        <button
          onClick={() =>
            navigate("/admin/manage-users")
          }
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition font-medium"
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>

        {/* ================= HEADER ================= */}

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User Details
          </h1>

          <p className="text-gray-500 mt-1">
            View and manage user information
          </p>
        </div>

        {/* ================= USER INFORMATION ================= */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

          {/* HEADER */}

          <div className="px-7 py-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-pink-50">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                <User
                  size={28}
                  className="text-orange-500"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  {user.fullname || "N/A"}
                </h2>

                <p className="text-gray-500">
                  @{user.username}
                </p>

              </div>

            </div>

          </div>

          {/* DETAILS */}

          <div className="p-7">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* FULL NAME */}

              <div className="border border-gray-200 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Full Name
                </p>

                <p className="font-semibold text-gray-800">
                  {user.fullname || "N/A"}
                </p>

              </div>

              {/* USERNAME */}

              <div className="border border-gray-200 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-1">
                  Username
                </p>

                <p className="font-semibold text-gray-800">
                  @{user.username}
                </p>

              </div>

              {/* EMAIL */}

              <div className="border border-gray-200 rounded-xl p-5">

                <div className="flex items-center gap-2 mb-1">

                  <Mail
                    size={15}
                    className="text-gray-400"
                  />

                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                </div>

                <p className="font-semibold text-gray-800 break-all">
                  {user.email}
                </p>

              </div>

              {/* STATUS */}

              <div className="border border-gray-200 rounded-xl p-5">

                <p className="text-sm text-gray-500 mb-2">
                  Account Status
                </p>

                {user.status === "ACTIVE" ? (

                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                    <CheckCircle size={15} />

                    ACTIVE

                  </span>

                ) : (

                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">

                    <XCircle size={15} />

                    {user.status}

                  </span>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* ================= CURRENT ROLES ================= */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-7">

          <div className="flex items-center gap-3 mb-5">

            <Shield
              size={21}
              className="text-orange-500"
            />

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Current Roles
              </h2>

              <p className="text-sm text-gray-500">
                Roles currently assigned to this user
              </p>

            </div>

          </div>

          {user.roles?.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {user.roles.map((role) => (

                <span
                  key={role}
                  className="px-4 py-2 rounded-xl bg-orange-100 text-orange-700 font-semibold text-sm"
                >
                  {role.replace("ROLE_", "")}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-gray-500 text-sm">
              No role assigned
            </p>

          )}

        </div>

        {/* ================= ASSIGN ROLES ================= */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-7">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">

              <Shield
                size={20}
                className="text-orange-500"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Assign Roles
              </h2>

              <p className="text-sm text-gray-500">
                Select one or more roles for this user
              </p>

            </div>

          </div>

          {/* ROLE LIST */}

          {loadingRoles ? (

            <div className="space-y-3 max-w-xl">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="h-12 bg-gray-200 rounded-xl animate-pulse"
                />

              ))}

            </div>

          ) : roles.length === 0 ? (

            <p className="text-gray-500 text-sm">
              No roles available.
            </p>

          ) : (

            <div className="max-w-xl space-y-3">

              {roles.map((role) => {

                const isSelected =
                  selectedRoles.includes(
                    role.name
                  );

                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() =>
                      handleRoleChange(
                        role.name
                      )
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition text-left ${
                      isSelected
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      {/* CHECKBOX */}

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >

                        {isSelected && (
                          <Check
                            size={14}
                            className="text-white"
                          />
                        )}

                      </div>

                      <span
                        className={`font-medium ${
                          isSelected
                            ? "text-orange-700"
                            : "text-gray-700"
                        }`}
                      >
                        {role.name.replace(
                          "ROLE_",
                          ""
                        )}
                      </span>

                    </div>

                    {isSelected && (
                      <span className="text-xs font-semibold text-orange-600">
                        Selected
                      </span>
                    )}

                  </button>
                );
              })}

            </div>

          )}

          {/* SELECTED COUNT */}

          {selectedRoles.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              {selectedRoles.length} role
              {selectedRoles.length > 1
                ? "s"
                : ""}{" "}
              selected
            </p>
          )}

          {/* ASSIGN BUTTON */}

          <button
            type="button"
            onClick={handleAssignRoles}
            disabled={
              selectedRoles.length === 0 ||
              savingRole ||
              loadingRoles
            }
            className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            <Save size={18} />

            {savingRole
              ? "Assigning..."
              : "Assign Selected Roles"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default UserDetailPage;