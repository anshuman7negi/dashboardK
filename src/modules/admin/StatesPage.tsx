import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../../services/countryApi";
import { getStatesByCountry } from "../../services/stateApi";

const StatesPage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number>();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCountries().then((data) => {
      setCountries(data);
      if (data.length > 0) {
        setSelectedCountry(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getStatesByCountry(selectedCountry).then(setStates);
    }
  }, [selectedCountry]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-semibold mb-3">
            States
          </h2>

          <select
            value={selectedCountry || ""}
            onChange={(e) =>
              setSelectedCountry(Number(e.target.value))
            }
            className="border px-3 py-2 rounded-lg"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate("/admin/states/create")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          + Create State
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3">Name</th>
            <th>Image</th>
          </tr>
        </thead>

        <tbody>
          {states.map((state) => (
            <tr key={state.id} className="border-b">
              <td className="py-3">{state.name}</td>
              <td>
                {state.imageUrl && (
                  <img
                    src={state.imageUrl}
                    alt=""
                    className="h-10"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StatesPage;
