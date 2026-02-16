const AgentDashboard = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">

      <Card title="Total Packages" value="24" />
      <Card title="Active Packages" value="18" />
      <Card title="Pending Approval" value="4" />
      <Card title="Total Revenue" value="₹1,45,000" />

    </div>
  );
};

const Card = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

export default AgentDashboard;
