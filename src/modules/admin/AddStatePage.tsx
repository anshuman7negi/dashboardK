import { useEffect, useState } from "react";
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
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">
        Add State
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="State Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
          required
        />

        <select
          value={countryId || ""}
          onChange={(e) =>
            setCountryId(Number(e.target.value))
          }
          className="w-full border px-4 py-3 rounded-lg"
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
          required
        />

        <button
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create State"}
        </button>
      </form>
    </div>
  );
};

export default AddStatePage;
