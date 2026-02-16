import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../../services/countryApi";

const CountriesPage = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCountries().then(setCountries);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Countries
        </h2>

        <button
          onClick={() => navigate("/admin/countries/create")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Country
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
          {countries.map((country) => (
            <tr key={country.id} className="border-b">
              <td className="py-3">{country.name}</td>
              <td>
                {country.imageUrl && (
                  <img
                    src={country.imageUrl}
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

export default CountriesPage;
