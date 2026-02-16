import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenuePage = () => {
  // Static demo data (abhi backend nahi hai)
  const totalAgents = 50;
  const activeAgents = 35;
  const inactiveAgents = totalAgents - activeAgents;

  const totalRevenue = 245000;
  const totalExpense = 80000;
  const netProfit = totalRevenue - totalExpense;

  const pieData = [
    { name: "Active", value: activeAgents },
    { name: "Inactive", value: inactiveAgents },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="space-y-8">

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Agents" value={totalAgents} />
        <Card title="Total Revenue" value={`₹${totalRevenue}`} />
        <Card title="Total Expense" value={`₹${totalExpense}`} />
        <Card title="Net Profit" value={`₹${netProfit}`} />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">
          Agent Status Overview
        </h3>

        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default RevenuePage;

const Card = ({ title, value }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);
