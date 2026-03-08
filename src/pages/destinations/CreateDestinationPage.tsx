import React, { useEffect, useState } from "react";
import { ImagePlus, MapPin } from "lucide-react";
import { getAllCountries, type CountryDto } from "../../services/countryApi";
import { getStatesByCountry, type StateDto } from "../../services/stateApi";
import { getAllCategories, type CategoryDto } from "../../services/CategoryService";
import { createDestination } from "../../services/destinationApi";


export const CreateDestinationPage: React.FC = () => {

  /* ================= DATA ================= */
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [states, setStates] = useState<StateDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [errors, setErrors] = useState<any>({});

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

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCountries(true);
        const [countryData, categoryData] = await Promise.all([
          getAllCountries(),
          getAllCategories(),
        ]);

        setCountries(countryData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load master data", error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadData();
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

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.countryId) newErrors.countryId = "Country is required";
    if (!form.stateId) newErrors.stateId = "State is required";

    if (!form.name.trim()) newErrors.name = "Destination name is required";

    const shortWords = form.shortDescription.trim().split(/\s+/);
    if (!form.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    else if (shortWords.length > 10)
      newErrors.shortDescription = "Maximum 10 words allowed";

    const fullWords = form.fullDescription.trim().split(/\s+/);
    if (!form.fullDescription.trim())
      newErrors.fullDescription = "Full description is required";
    else if (fullWords.length < 50)
      newErrors.fullDescription = "Minimum 50 words required";

    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (!form.latitude) newErrors.latitude = "Latitude required";
    if (!form.longitude) newErrors.longitude = "Longitude required";

    if (selectedCategories.length === 0)
      newErrors.categories = "Select at least one category";

    if (images.length === 0)
      newErrors.images = "Upload at least one image";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await createDestination(
        {
          stateId: form.stateId,
          countryId: form.countryId,
          name: form.name,
          shortDescription: form.shortDescription,
          fullDescription: form.fullDescription,
          address: form.address,
          pincode: form.pincode,
          youtubeVideoUrl: form.youtubeVideoUrl,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          categoryIds: selectedCategories,
        },
        images
      );

      setSuccess(true);
      setSubmitting(false);

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

      setSelectedCategories([]);
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

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Add a Destination
          </h1>
          <p className="text-gray-500 mt-2">
            Submit your travel destination for review
          </p>
        </div>

        <div
          key={formKey}
          className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 space-y-8"
        >

          {/* LOCATION SELECT */}
          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>

              <select
                className={`input-style w-full ${errors.countryId ? "border-red-500" : ""}`}
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
                  {loadingCountries ? "Loading countries..." : "Select country"}
                </option>

                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}

              </select>

              {errors.countryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.countryId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>

              <select
                className={`input-style w-full ${errors.stateId ? "border-red-500" : ""}`}
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
                      : "Select state"}
                </option>

                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}

              </select>

              {errors.stateId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.stateId}
                </p>
              )}
            </div>
          </section>

          {/* CATEGORY SELECT */}
          <section>
            <label className="text-sm font-medium mb-2 block">
              Select Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== cat.id)
                          : [...prev, cat.id]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-sm border transition ${isSelected
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </section>
          {errors.categories && (
            <p className="text-red-500 text-xs mt-1">
              {errors.categories}
            </p>
          )}

          {/* BASIC INFO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Name <span className="text-red-500">*</span>
            </label>

            <input
              className={`input-style w-full ${errors.name ? "border-red-500" : ""}`}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={2}
              className={`input-style w-full ${errors.shortDescription ? "border-red-500" : ""}`}
              value={form.shortDescription}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 10) {
                  setForm({ ...form, shortDescription: e.target.value });
                }
              }}
            />

            <p className="text-xs text-gray-400">
              Max 10 words
            </p>

            {errors.shortDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shortDescription}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={6}
              className={`input-style w-full ${errors.fullDescription ? "border-red-500" : ""}`}
              value={form.fullDescription}
              onChange={(e) =>
                setForm({ ...form, fullDescription: e.target.value })
              }
            />

            <p className="text-xs text-gray-400">
              Minimum 50 words
            </p>

            {errors.fullDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullDescription}
              </p>
            )}
          </div>

          {/* ADDRESS + PINCODE + YOUTUBE */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>

              <input
                className={`input-style w-full ${errors.address ? "border-red-500" : ""}`}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>

              <input
                className={`input-style w-full ${errors.pincode ? "border-red-500" : ""}`}
                value={form.pincode}
                onChange={(e) =>
                  setForm({ ...form, pincode: e.target.value })
                }
              />

              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pincode}
                </p>
              )}
            </div>

            <input
              placeholder="YouTube Video URL"
              className="input-style"
              value={form.youtubeVideoUrl}
              onChange={(e) =>
                setForm({ ...form, youtubeVideoUrl: e.target.value })
              }
            />
          </div>

          {/* LAT LONG */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>

              <input
                className={`input-style w-full ${errors.latitude ? "border-red-500" : ""}`}
                value={form.latitude}
                onChange={(e) =>
                  setForm({ ...form, latitude: e.target.value })
                }
              />

              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.latitude}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>

              <input
                className={`input-style w-full ${errors.longitude ? "border-red-500" : ""}`}
                value={form.longitude}
                onChange={(e) =>
                  setForm({ ...form, longitude: e.target.value })
                }
              />

              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.longitude}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Copy coordinates from Google Maps
          </p>

          {/* IMAGES */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Photos (up to 5)
            </h2>

            <div className="flex flex-wrap gap-4 mb-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group w-28 h-28">
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
          {errors.images && (
            <p className="text-red-500 text-xs mt-2">
              {errors.images}
            </p>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end pt-6 border-t">
            {success && (
              <div className="p-3 rounded-lg bg-green-100 text-green-700 border border-green-300">
                Destination submitted successfully 🎉
              </div>
            )}
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-green-600 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};