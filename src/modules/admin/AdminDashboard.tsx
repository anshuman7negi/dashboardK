const AdminDashboard = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card title="Total Users" value="1,245" />
      <Card title="Destinations" value="320" />
      <Card title="Pending Approvals" value="18" />
    </div>
  );
};

const Card = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

export default AdminDashboard;
