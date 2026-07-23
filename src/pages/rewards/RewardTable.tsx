import { useEffect, useState } from "react";
import { Pencil, Trash2, Gift } from "lucide-react";
import toast from "react-hot-toast";
import { getRewards } from "../../services/RewardService";

interface RewardDto {
  id: number;
  title: string;
  points: number;
  description: string;
  badgeIcon: string;
}

const RewardTable = () => {
  const [rewards, setRewards] = useState<RewardDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRewards = async () => {
    try {
      setLoading(true);

      const rewards = await getRewards();

      setRewards(rewards);
    } catch (e) {
      toast.error("Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-20">
        <Gift size={70} className="mx-auto text-gray-300" />

        <h2 className="mt-6 text-xl font-semibold text-gray-600">
          No Rewards Found
        </h2>

        <p className="text-gray-400 mt-2">Create your first reward.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold">Badge</th>

            <th className="px-6 py-4 text-left text-sm font-bold">Title</th>

            <th className="px-6 py-4 text-left text-sm font-bold">Points</th>

            <th className="px-6 py-4 text-left text-sm font-bold">
              Description
            </th>

            <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
          </tr>
        </thead>

        <tbody>
          {rewards.map((reward) => (
            <tr
              key={reward.id}
              className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-300"
            >
              {/* Badge */}

              <td className="px-6 py-4">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-lg border-2 border-amber-200">
                  <img
                    src={reward.badgeIcon}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </td>

              {/* Title */}

              <td className="px-6 py-6">
                <h3 className="text-md font-bold text-gray-800">
                  {reward.title}
                </h3>
              </td>

              {/* Points */}

              <td className="px-6 py-4">
                <div
                  className="inline-flex items-center justify-center
w-16 h-16 rounded-full
bg-gradient-to-br
from-yellow-100
via-orange-100
to-orange-200
text-orange-600
font-bold
text-xl
shadow"
                >
                  {reward.points}
                </div>
              </td>

              {/* Description */}

              <td className="px-6 py-4 text-gray-600 max-w-md">
                {reward.description}
              </td>

              {/* Actions */}

              <td className="px-6 py-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => toast("Edit reward coming soon")}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <Pencil size={18} className="text-blue-600" />
                  </button>

                  <button
                    disabled
                    className="p-2 rounded-lg bg-red-50 opacity-50 cursor-not-allowed"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardTable;
