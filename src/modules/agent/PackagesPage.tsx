import { useState } from "react";

const PackagesPage = () => {
  const [packages] = useState([
    { id: 1, name: "Goa Trip", status: "ACTIVE" },
    { id: 2, name: "Manali Tour", status: "PENDING" },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Packages
        </h2>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          + Create Package
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3">Package Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.id} className="border-b">
              <td className="py-3">{pkg.name}</td>
              <td>{pkg.status}</td>
              <td className="space-x-3">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500">Delete</button>
                <button className="text-green-600">Approve</button>
                <button className="text-yellow-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default PackagesPage;
