import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllCountries, type CountryDto } from "../../services/countryApi";
import { getStatesByCountry } from "../../services/stateApi";

interface StateDto {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string | null;
}

const StatesPage = () => {
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [states, setStates] = useState<StateDto[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  const navigate = useNavigate();

  /* FETCH COUNTRIES */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
        if (data.length > 0) {
          setSelectedCountry(data[0].id);
        }
      } catch {
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  /* FETCH STATES */
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const data = await getStatesByCountry(selectedCountry);
        setStates(data);
      } catch {
        toast.error("Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  return (
    <div className="relative min-h-screen -mt-6 -mx-6 px-6 py-12 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* Watermark */}
      <div className="absolute inset-0 rotate-[-25deg] opacity-10 text-orange-600 font-extrabold pointer-events-none select-none flex flex-wrap justify-center items-center gap-24 text-[90px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-10">

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              States Management
            </h1>
            <p className="text-gray-500 mt-2">
              View states by country
            </p>
          </div>
        </div>

        {/* SELECT COUNTRY (SMALLER) */}
        {/* SELECT + BUTTON ROW */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                Select Country:
              </h2>

              {loadingCountries ? (
                <div className="h-10 w-56 bg-gray-200 rounded-xl animate-pulse" />
              ) : (
                <select
                  value={selectedCountry ?? ""}
                  onChange={(e) =>
                    setSelectedCountry(Number(e.target.value))
                  }
                  className="border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none w-56"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex gap-4">

              <button
                onClick={() => navigate("/admin/create-country")}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
              >
                Create Country
              </button>

              <button
                onClick={() => navigate("/admin/create-state")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-[1.02] transition"
              >
                Create State
              </button>

            </div>

          </div>

        </div>


        {/* STATES GRID */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8">

          <h2 className="text-xl font-semibold mb-8 text-gray-800">
            States
          </h2>

          {loadingStates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : states.length === 0 ? (
            <p className="text-gray-500">
              No states found for this country.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {states.map((state) => (
                <div
                  key={state.id}
                  className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-xl transition duration-300"
                >
                  {/* IMAGE */}
                  {state.imageUrl ? (
                    <img
                      src={state.imageUrl}
                      alt={state.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {state.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                      {state.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default StatesPage;
