import { useEffect, useState } from "react";
import { MapPin, Users, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { approveDestinationDraft, fetchAdminDrafts, rejectDestinationDraft } from "../../services/adminDestinationApi";


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

const NoImagePlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
    No Image
  </div>
);

export const ApproveRejectDestinations: React.FC = () => {
  const PAGE_SIZE = 10;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>("PENDING");
  const [page, setPage] = useState(0);
  const [drafts, setDrafts] = useState<DraftDestination[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [resultMap, setResultMap] = useState<
    Record<number, "APPROVED" | "REJECTED">
  >({});

  const loadDrafts = () => {
  setLoading(true);

  fetchAdminDrafts(status)
    .then((res) => {
      setDrafts(
        res.map((d) => ({
          id: d.id,
          name: d.name,
          stateName: "Unknown", // backend currently not sending
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
  }, [status, page]);

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
      }, 1200);
    } catch {
      toast.error("Approve failed");
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Reason for rejection (optional)") || undefined;

    try {
      setProcessingId(id);
      await rejectDestinationDraft(id, reason);

      setResultMap((p) => ({ ...p, [id]: "REJECTED" }));
      toast.success("Destination rejected");

      setTimeout(() => {
        setProcessingId(null);
        setResultMap({});
        loadDrafts();
      }, 1200);
    } catch {
      toast.error("Reject failed");
      setProcessingId(null);
    }
  };

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
            onChange={(e) => {
              setStatus(e.target.value as Status);
              setPage(0);
            }}
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

          {!loading &&
            drafts.map((d) => (
              <div
                key={d.id}
                className="relative bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
              >

                {processingId === d.id && !resultMap[d.id] && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                  </div>
                )}

                {resultMap[d.id] === "APPROVED" && (
                  <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center z-10">
                    <Check className="w-20 h-20 text-white" />
                  </div>
                )}

                {resultMap[d.id] === "REJECTED" && (
                  <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center z-10">
                    <X className="w-20 h-20 text-white" />
                  </div>
                )}

                <div className="aspect-[16/9] bg-gray-100">
                  {d.imageUrl ? (
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <NoImagePlaceholder />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{d.name}</h3>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {d.stateName}
                  </p>

                  <p className="text-sm mt-2">{d.description}</p>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-3">
                    <Users className="w-4 h-4" />
                    Crowd: {d.crowdLevel}
                  </div>

                  {status === "PENDING" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        disabled={processingId === d.id}
                        onClick={() => handleApprove(d.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="inline w-4 h-4" /> Approve
                      </button>

                      <button
                        disabled={processingId === d.id}
                        onClick={() => handleReject(d.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="inline w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="mt-2 text-sm">
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};