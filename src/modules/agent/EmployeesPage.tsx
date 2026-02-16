import { useState } from "react";

const EmployeesPage = () => {
  const employees = [
    { id: 1, name: "Rahul" },
  ];

  const [selectedEmp, setSelectedEmp] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const allPermissions = [
    "VIEW_PACKAGES",
    "CREATE_PACKAGE",
    "UPDATE_PACKAGE",
    "APPROVE_PACKAGE",
    "VIEW_REVENUE",
  ];

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Search Employee */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Select Employee
        </h2>

        <select
          className="w-full border p-3 rounded"
          onChange={(e) => setSelectedEmp(Number(e.target.value))}
        >
          <option value="">-- Select Employee --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Permissions */}
      {selectedEmp && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Assign Permissions
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {allPermissions.map(perm => (
              <label key={perm} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
                {perm}
              </label>
            ))}
          </div>

          <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded">
            Save Permissions
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
