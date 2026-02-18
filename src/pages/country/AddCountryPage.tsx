import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import {
  createCountry,
  getAllCountries,
  type CountryDto,
} from "../../services/countryApi";

const AddCountryPage = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});

  /* ================= FETCH COUNTRIES ================= */
  const fetchCountries = async () => {
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch {
      toast.error("Failed to load countries");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Country name is required";
    if (!code.trim()) newErrors.code = "Country code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await createCountry({
        name: name.trim(),
        code: code.trim().toUpperCase(),
      });

      toast.success("Country created successfully 🎉");

      setName("");
      setCode("");
      fetchCountries();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to create country"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 px-6 py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* Watermark */}
      <div className="absolute inset-0 rotate-[-25deg] opacity-10 text-orange-600 font-extrabold pointer-events-none select-none flex flex-wrap justify-center items-center gap-24 text-[90px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Country Management
          </h1>
          <p className="text-gray-500 mt-2">
            Add and manage platform countries
          </p>
        </div>

        {/* ================= ADD COUNTRY CARD ================= */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-10">

          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Add New Country
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className={`w-full border pl-12 pr-4 py-3 rounded-xl focus:ring-2 outline-none transition
                    ${
                      errors.name
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-orange-400"
                    }`}
                />
              </div>

              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country Code
              </label>

              <input
                type="text"
                placeholder="IN"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full border px-4 py-3 rounded-xl focus:ring-2 outline-none transition
                  ${
                    errors.code
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-orange-400"
                  }`}
              />

              {errors.code && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.code}
                </p>
              )}
            </div>

            {/* Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-[1.02] transition shadow-lg disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create Country"}
              </button>
            </div>

          </form>
        </div>

        {/* ================= COUNTRY LIST ================= */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-10">

          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            Existing Countries
          </h2>

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">

            {/* Skeleton */}
            {listLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}

            {!listLoading && countries.length === 0 && (
              <p className="text-gray-500 text-sm">
                No countries found.
              </p>
            )}

            {!listLoading &&
              countries.map((country) => (
                <div
                  key={country.id}
                  className="px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-orange-50 transition flex justify-between items-center"
                >
                  <span className="font-medium text-gray-700">
                    {country.name}
                  </span>

                  <span className="text-sm text-gray-400">
                    {country.imageUrl || "—"}
                  </span>
                </div>
              ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AddCountryPage;
