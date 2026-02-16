import { useState } from "react";
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createCountry } from "../../services/countryApi";

const AddCountryPage = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCountry({ name, code });
      alert("Country created successfully!");
      navigate("/admin/countries");
    } catch (err) {
      alert("Failed to create country");
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
      <div className="relative z-10 w-full max-w-2xl py-16">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Add New Country
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Add a new country to the Krowdless platform.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10">

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* Country Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Country Name
              </label>

              <div className="relative">
                <Globe
                  className="absolute left-4 top-4 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="India"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 pl-12 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Country Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Country Code
              </label>

              <input
                type="text"
                placeholder="IN"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-[1.02] transition shadow-lg disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Country"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCountryPage;
