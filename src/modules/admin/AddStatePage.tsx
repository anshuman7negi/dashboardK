import { useEffect, useState } from "react";
import { Globe, ImagePlus } from "lucide-react";
import { getAllCountries } from "../../services/countryApi";
import { createState } from "../../services/stateApi";

const AddStatePage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [countryId, setCountryId] = useState<number>();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCountries().then(setCountries);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !countryId) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    try {
      await createState({
        name,
        description,
        countryId,
        image,
      });

      alert("State created successfully!");
      setName("");
      setDescription("");
      setCountryId(undefined);
      setImage(null);
    } catch (err) {
      alert("Failed to create state");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">

      {/* Watermark Background */}
      <div className="absolute inset-0 rotate-[-25deg] opacity-10 text-orange-600 font-extrabold pointer-events-none select-none flex flex-wrap justify-center items-center gap-24 text-[60px] sm:text-[100px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl py-16">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Add New State
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Add a new tourism state with slogan and media.
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10">

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* State Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State Name
              </label>

              <input
                type="text"
                placeholder="Himachal Pradesh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tourism Slogan / Description
              </label>

              <textarea
                placeholder="Add tourism slogan of this state (e.g. 'Land of Gods')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition resize-none"
                required
              />
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Country
              </label>

              <div className="relative">
                <Globe
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <select
                  value={countryId || ""}
                  onChange={(e) =>
                    setCountryId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full border border-gray-200 pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition bg-white"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State Image
              </label>

              <label className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-2xl py-6 cursor-pointer hover:border-orange-400 transition">
                <ImagePlus size={20} className="text-gray-400" />
                <span className="text-gray-500 text-sm">
                  {image ? image.name : "Upload state image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                  required
                />
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-[1.02] transition shadow-lg disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create State"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStatePage;
