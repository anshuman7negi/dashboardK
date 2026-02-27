import { useEffect, useState } from "react";
import { MapPin, Users, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  approveDestinationDraft,
  fetchAdminDrafts,
  rejectDestinationDraft,
} from "../../services/adminDestinationApi";
import { useNavigate } from "react-router-dom";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface DraftDestination {
  id: number;
  name: string;
  stateName: string;
  description: string;
  imageUrl: string | null;
  crowdLevel: "LOW" | "MEDIUM" | "HIGH";
  status: Status;
}

export const ApproveRejectDestinations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("PENDING");
  const [drafts, setDrafts] = useState<DraftDestination[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [resultMap, setResultMap] = useState<
    Record<number, "APPROVED" | "REJECTED">
  >({});

  const navigate = useNavigate();

  // 🔥 Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadDrafts = () => {
    setLoading(true);

    fetchAdminDrafts()
      .then((res) => {
        const filtered = res.filter((d) => d.status === status);

        setDrafts(
          filtered.map((d) => ({
            id: d.id,
            name: d.name,
            stateName: "Unknown",
            description: d.shortDescription,
            imageUrl: d.coverImage || null,
            crowdLevel: "MEDIUM",
            status: d.status,
          }))
        );
      })
      .catch(() => {
        toast.error("Failed to load drafts");
        setDrafts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDrafts();
  }, [status]);

  const handleApprove = async (id: number) => {
    try {
      setProcessingId(id);
      await approveDestinationDraft(id);

      setResultMap((p) => ({ ...p, [id]: "APPROVED" }));
      toast.success("Destination approved");

      setTimeout(() => {
        setProcessingId(null);
        setResultMap({});
        loadDrafts();
      }, 1000);
    } catch {
      toast.error("Approve failed");
      setProcessingId(null);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectId) return;

    try {
      setProcessingId(rejectId);
      await rejectDestinationDraft(rejectId, rejectReason || undefined);

      setResultMap((p) => ({ ...p, [rejectId]: "REJECTED" }));
      toast.success("Destination rejected");

      setRejectModalOpen(false);

      setTimeout(() => {
        setProcessingId(null);
        setResultMap({});
        loadDrafts();
      }, 1000);
    } catch {
      toast.error("Reject failed");
      setProcessingId(null);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow animate-pulse overflow-hidden">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="flex gap-2 mt-4">
          <div className="h-9 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Destinations suggested by users
            </h1>
            <p className="text-gray-600">
              Review & approve user submissions
            </p>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

          {!loading && drafts.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-20">
              No {status.toLowerCase()} destinations found
            </div>
          )}
          { !loading && drafts.map((d) => (
            <div
              key={d.id}
              className="relative bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              <div className="aspect-[16/9] bg-gray-100">
                {d.imageUrl ? (
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{d.name}</h3>

                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {d.stateName}
                </p>

                <p className="text-sm mt-2">{d.description}</p>

                {status === "PENDING" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleApprove(d.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      <Check className="inline w-4 h-4" /> Approve
                    </button>

                    <button
                      onClick={() => openRejectModal(d.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                      <X className="inline w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Professional Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Reject Destination
            </h2>

            <label className="block text-sm font-medium mb-2">
              Reason for rejection
            </label>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a clear and professional reason..."
              className="w-full border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmReject}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};