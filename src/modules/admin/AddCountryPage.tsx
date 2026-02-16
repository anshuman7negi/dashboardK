import { useState } from "react";
import { Globe, ArrowLeft } from "lucide-react";
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
    <div className="max-w-3xl mx-auto">

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Country
          </h1>
          <p className="text-gray-500 mt-1">
            Add a new country to the Krowdless platform.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Country Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Name
            </label>

            <div className="relative">
              <Globe
                className="absolute left-4 top-3 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="India"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Code
            </label>

            <input
              type="text"
              placeholder="IN"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 transition shadow-md"
            >
              {loading ? "Creating..." : "Create Country"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCountryPage;
