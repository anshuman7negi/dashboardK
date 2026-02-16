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

      {/* ===== Stats Cards ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Agents" value={totalAgents} />
        <Card title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
        <Card title="Total Expense" value={`₹${totalExpense.toLocaleString()}`} />
        <Card title="Net Profit" value={`₹${netProfit.toLocaleString()}`} />
      </div>

      {/* ===== Chart Section ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">
          Agent Status Overview
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {/* FIXED: entry removed */}
                {pieData.map((_, index) => (
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

interface CardProps {
  title: string;
  value: string | number;
}

const Card = ({ title, value }: CardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);
