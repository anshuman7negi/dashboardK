import { useEffect, useState } from "react";
import { MapPin, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAdminDestinations
} from "../../services/adminDestinationApi";
import { getAllCountries } from "../../services/countryApi";
import { getStatesByCountry } from "../../services/stateApi";
import { useNavigate } from "react-router-dom";

type Status = "PENDING" | "APPROVED" | "REJECTED";

export const ApproveRejectDestinations: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("PENDING");

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [countryId, setCountryId] = useState<number | undefined>();
  const [stateId, setStateId] = useState<number | undefined>();

  const [keyword, setKeyword] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  const [drafts, setDrafts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  /* ================= LOAD COUNTRIES ================= */

  useEffect(() => {
    getAllCountries().then((res) => {
      setCountries(res);

      const india = res.find((c: any) =>
        c.name.toLowerCase() === "india"
      );

      if (india) {
        setCountryId(india.id);
      }
    });
  }, []);

  /* ================= LOAD STATES ================= */

  useEffect(() => {
    if (!countryId) return;

    getStatesByCountry(countryId).then((res) => {
      setStates(res);
      setStateId(undefined); // default all
    });
  }, [countryId]);

  /* ================= LOAD DESTINATIONS ================= */

  const loadDestinations = () => {
    setLoading(true);

    fetchAdminDestinations({
      status,
      keyword: keyword || undefined,
      countryId,
      stateId,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      createdBy: createdBy || undefined,
      page,
      size: 10,
    })
      .then((res) => {
        setDrafts(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        toast.error("Failed to load destinations");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDestinations();
  }, [status, page, countryId, stateId]);



  return (
    <section className="py-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Admin Destination Review
          </h1>

          {/* FILTER TOGGLE BUTTON */}
          <button
            onClick={() => setFilterOpen((p) => !p)}
            className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:scale-105 transition"
          >
            Filters
          </button>
        </div>

        {/* ================= FILTER PANEL ================= */}
        {filterOpen && (
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-3xl shadow-xl mb-10 animate-fadeIn">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* ===== LEFT SIDE ===== */}
              <div className="space-y-6">

                <div>
                  <label className="label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Country</label>
                    <select
                      value={countryId}
                      onChange={(e) => setCountryId(Number(e.target.value))}
                      className="select"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">State</label>
                    <select
                      value={stateId || ""}
                      onChange={(e) =>
                        setStateId(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="select"
                    >
                      <option value="">All States</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* ===== RIGHT SIDE ===== */}
              <div className="space-y-6">

                <div>
                  <label className="label">Destination Name</label>
                  <input
                    type="text"
                    placeholder="Search destination..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Created By</label>
                  <input
                    type="text"
                    placeholder="Enter username..."
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Created From</label>
                    <input
                      type="date"
                      value={createdFrom}
                      onChange={(e) => setCreatedFrom(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Created To</label>
                    <input
                      type="date"
                      value={createdTo}
                      onChange={(e) => setCreatedTo(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setKeyword("");
                  setCreatedBy("");
                  setStateId(undefined);
                  setCreatedFrom("");
                  setCreatedTo("");
                }}
                className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              >
                Reset
              </button>

              <button
                onClick={() => {
                  setPage(0);
                  loadDestinations();
                }}
                className="px-8 py-2 rounded-full bg-blue-600 text-white shadow-md hover:shadow-xl hover:scale-105 transition"
              >
                Apply Filters
              </button>
            </div>

          </div>
        )}
        {/* ================= DESTINATION GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {loading && <div>Loading...</div>}

          {!loading && drafts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500 animate-fadeIn">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-medium">
                No data found
              </p>
              <p className="text-sm">
                Try adjusting filters or check later.
              </p>
            </div>
          )}

          {!loading &&
            drafts.map((d) => (
              <div
                key={d.id}
                onClick={() => navigate(`/admin/destination/${d.id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden hover:-translate-y-1"
              >
                <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                  {d.coverImageUrl && (
                    <img
                      src={d.coverImageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-xl mb-1">
                    {d.name}
                  </h3>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {d.stateName}
                  </p>

                  <p className="text-sm mt-3 text-gray-700">
                    {d.shortDescription}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {!loading && drafts.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-4 items-center">

            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="w-12 h-12 rounded-full bg-white shadow hover:bg-gray-100 transition disabled:opacity-40"
            >
              ←
            </button>

            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold shadow">
              {page + 1}
            </div>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-12 h-12 rounded-full bg-white shadow hover:bg-gray-100 transition disabled:opacity-40"
            >
              →
            </button>

          </div>
        )}

      </div>
    </section>
  );
};