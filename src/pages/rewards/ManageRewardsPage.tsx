import RewardForm from "./RewardForm";
import RewardTable from "./RewardTable";


const ManageRewardsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800">
            Reward Management
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Create and manage reward badges
          </p>
        </div>

        {/* Create Reward */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10 mb-10">

          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Create Reward
          </h2>

          <RewardForm />

        </div>

        {/* Existing Rewards */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Existing Rewards
              </h2>

              <p className="text-gray-500 mt-1">
                View, edit and manage all rewards
              </p>
            </div>

          </div>

          <RewardTable />

        </div>

      </div>

    </div>
  );
};

export default ManageRewardsPage;