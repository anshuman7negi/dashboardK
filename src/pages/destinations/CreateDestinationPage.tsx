import React, { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { getAllCountries, type CountryDto } from "../../services/countryApi";
import { getStatesByCountry, type StateDto } from "../../services/stateApi";
import { createDestinationDraft } from "../../services/DestinationDraftApi";

export const CreateDestinationPage: React.FC = () => {
  /* ================= DATA ================= */
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [states, setStates] = useState<StateDto[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    countryId: 0,
    stateId: 0,
    name: "",
    shortDescription: "",
    fullDescription: "",
    address: "",
    pincode: "",
    latitude: "",
    longitude: "",
    youtubeVideoUrl: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  /* ================= LOAD COUNTRIES ================= */
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await getAllCountries();
        setCountries(data);
      } catch (error) {
        console.error("Failed to load countries", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  /* ================= LOAD STATES ================= */
  useEffect(() => {
    if (!form.countryId) {
      setStates([]);
      return;
    }

    const loadStates = async () => {
      try {
        setLoadingStates(true);
        const data = await getStatesByCountry(form.countryId);
        setStates(data);
      } catch (error) {
        console.error("Failed to load states", error);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, [form.countryId]);

  /* ================= CLEANUP OBJECT URL ================= */
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files).slice(0, 5 - images.length);

    const newPreviews = selected.map((file) =>
      URL.createObjectURL(file)
    );

    setImages((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (
      !form.countryId ||
      !form.stateId ||
      !form.name ||
      !form.shortDescription
    ) {
      alert("Please fill required fields");
      return;
    }

    try {
      setSubmitting(true);

      await createDestinationDraft(
        {
          stateId: form.stateId,
          name: form.name,
          shortDescription: form.shortDescription,
          fullDescription: form.fullDescription,
          address: form.address,
          pincode: form.pincode,
          youtubeVideoUrl: form.youtubeVideoUrl,
          latitude: form.latitude
            ? Number(form.latitude)
            : undefined,
          longitude: form.longitude
            ? Number(form.longitude)
            : undefined,
        },
        images
      );

      setSuccess(true);
      setSubmitting(false);

      // Reset
      setForm({
        countryId: 0,
        stateId: 0,
        name: "",
        shortDescription: "",
        fullDescription: "",
        address: "",
        pincode: "",
        latitude: "",
        longitude: "",
        youtubeVideoUrl: "",
      });

      setImages([]);
      setPreviews([]);
      setFormKey((k) => k + 1);

      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Add a Destination
          </h1>
          <p className="text-gray-500 mt-2">
            Submit your travel destination for review
          </p>
        </div>

        {/* CARD */}
        <div
          key={formKey}
          className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 space-y-8"
        >

          {/* LOCATION */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Location Selection
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <select
                className="input-style"
                value={form.countryId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    countryId: Number(e.target.value),
                    stateId: 0,
                  })
                }
              >
                <option value={0}>
                  {loadingCountries
                    ? "Loading countries..."
                    : "Select country *"}
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select
                className="input-style"
                value={form.stateId}
                disabled={!form.countryId || loadingStates}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stateId: Number(e.target.value),
                  })
                }
              >
                <option value={0}>
                  {!form.countryId
                    ? "Select country first"
                    : loadingStates
                    ? "Loading states..."
                    : "Select state *"}
                </option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* BASIC INFO */}
          <input
            placeholder="Destination name *"
            className="input-style w-full"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            placeholder="Short description *"
            rows={3}
            className="input-style w-full"
            value={form.shortDescription}
            onChange={(e) =>
              setForm({
                ...form,
                shortDescription: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Full description"
            rows={5}
            className="input-style w-full"
            value={form.fullDescription}
            onChange={(e) =>
              setForm({
                ...form,
                fullDescription: e.target.value,
              })
            }
          />

          {/* IMAGES */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Photos (up to 5)
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative group w-28 h-28"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover rounded-xl shadow-md border"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {images.length < 5 && (
              <label className="flex items-center gap-2 cursor-pointer text-orange-600 font-medium hover:text-orange-700 transition">
                <ImagePlus className="w-5 h-5" />
                Add photos
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={(e) => {
                    handleImageChange(e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            )}
          </section>

          {/* SUBMIT */}
          <div className="flex justify-end pt-6 border-t">
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-green-600 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>

      {/* LOADER */}
      {submitting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-xl animate-bounce">
            ✓
          </div>
        </div>
      )}
    </div>
  );
};