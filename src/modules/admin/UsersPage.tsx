import { useState } from "react";

const UsersPage = () => {
  const users = [
    {
      id: 1,
      name: "Aman",
      email: "aman@mail.com",
      phone: "9876543210",
      status: "ACTIVE",
      role: "AGENT",
    },
  ];

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [permissions, setPermissions] = useState<string[]>([]);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const allPermissions = [
    "DESTINATION_CREATE",
    "DESTINATION_APPROVE",
    "USER_MANAGE",
    "REVENUE_VIEW",
  ];

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSave = () => {
    alert(
      `Saved:\nUser: ${selectedUser?.name}\nRole: ${role}\nStatus: ${status}\nPermissions: ${permissions.join(", ")}`
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Search User */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Select User
        </h2>

        <select
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          <option value="">-- Select User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* User Details */}
      {selectedUser && (
        <>
          {/* Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              User Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{selectedUser.phone}</p>
              </div>

              <div>
                <p className="text-gray-500">Current Status</p>
                <p className="font-medium">{selectedUser.status}</p>
              </div>
            </div>
          </div>

          {/* Role Assignment */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Role Assignment
            </h3>

            <select
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-orange-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">-- Select Role --</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPPORT_ADMIN">SUPPORT_ADMIN</option>
              <option value="AGENT">AGENT</option>
            </select>

            {/* Status Toggle */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-600">
                Account Status:
              </span>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-lg p-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          {/* Permission Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Permissions
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {allPermissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                  />
                  <span className="text-sm">{perm}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;
