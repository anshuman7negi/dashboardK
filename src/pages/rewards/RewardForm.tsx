import { useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import {
  createReward,
  type RewardRequest,
} from "../../services/RewardService";

const RewardForm = () => {
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [badgeIcon, setBadgeIcon] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Reward title is required");
      return;
    }

    if (!points) {
      toast.error("Points are required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!badgeIcon) {
      toast.error("Please upload badge icon");
      return;
    }

    const request: RewardRequest = {
      title,
      points: Number(points),
      description,
    };

    try {
      setLoading(true);

      await createReward(request, badgeIcon);

      toast.success("Reward created successfully 🎉");

      setTitle("");
      setPoints("");
      setDescription("");
      setBadgeIcon(null);

      // File input clear
      const input = document.getElementById(
        "badgeIcon"
      ) as HTMLInputElement;

      if (input) input.value = "";
    } catch (error) {
      toast.error("Failed to create reward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Reward Title
        </label>

        <input
          type="text"
          placeholder="Explorer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      </div>

      {/* Points */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Points
        </label>

        <input
          type="number"
          placeholder="100"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>

        <textarea
          rows={4}
          placeholder="Reward description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-5 py-3 resize-none focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      </div>

      {/* Badge Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Badge Icon
        </label>

        <label
          htmlFor="badgeIcon"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-orange-400 transition"
        >
          <UploadCloud
            size={40}
            className="text-orange-500 mb-3"
          />

          <span className="text-gray-600 font-medium">
            {badgeIcon
              ? badgeIcon.name
              : "Click to upload badge icon"}
          </span>

          <span className="text-xs text-gray-400 mt-2">
            PNG, JPG, SVG
          </span>
        </label>

        <input
          id="badgeIcon"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              setBadgeIcon(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-lg font-semibold shadow-lg hover:scale-[1.02] transition-all"
      >
        {loading ? "Creating..." : "Create Reward"}
      </button>

    </div>
  );
};

export default RewardForm;