import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import {
  approveEvent,
  rejectEvent,
  fetchEventDetail,
} from "../../services/adminEventApi";

export const EventDetail = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchEventDetail(Number(id))
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await approveEvent(event.id);
      toast.success("Event approved");
      setEvent({ ...event, status: "APPROVED" });
    } catch {
      toast.error("Approval failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;

    try {
      setProcessing(true);
      await rejectEvent(event.id, rejectReason);
      toast.success("Event rejected");
      setEvent({ ...event, status: "REJECTED", adminRemark: rejectReason });
      setShowRejectModal(false);
    } catch {
      toast.error("Reject failed");
    } finally {
      setProcessing(false);
    }
  };

  const youtubeEmbed =
    event?.yturl?.replace("youtu.be/", "youtube.com/embed/") || "";

  /* ================= SKELETON ================= */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 animate-pulse">
        <div className="h-10 bg-gray-200 w-1/3 mb-6 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 rounded-xl md:col-span-2" />
          <div className="h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!event) return <div className="p-10">Event not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-6">{event.title}</h1>

      {/* ================= HERO GRID ================= */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* IMAGE CARD */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden">
          <img
            src={
              event.image ||
              "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg"
            }
            className="w-full h-[350px] object-cover"
          />
        </div>

        {/* VIDEO CARD */}
        {youtubeEmbed && (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-4 flex flex-col">

            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={youtubeEmbed}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

          </div>
        )}

      </div>

      {/* ================= META CARD ================= */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">

        <div className="flex items-center gap-6 text-gray-600">

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">
              {event.starteventdate} → {event.endeventdate}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                event.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : event.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {event.status}
          </span>

        </div>

      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Overview</h2>
        <p className="text-gray-600">{event.desc}</p>
      </div>

      {/* ================= DETAILS ================= */}
      {event.longdesc && (
        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Details</h2>
          <p className="text-gray-600 leading-relaxed">
            {event.longdesc}
          </p>
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      {event.status === "PENDING" && (
        <div className="flex gap-4">

          <button
            disabled={processing}
            onClick={handleApprove}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Approve
          </button>

          <button
            disabled={processing}
            onClick={() => setShowRejectModal(true)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Reject
          </button>

        </div>
      )}

      {/* ================= REJECT CARD ================= */}
      {event.status === "REJECTED" && event.adminRemark && (
        <div className="mt-6 bg-red-50 border border-red-200 p-6 rounded-2xl">
          <h3 className="font-semibold text-red-600 mb-2">
            Rejection Reason
          </h3>
          <p className="text-red-500">{event.adminRemark}</p>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">

            <h2 className="text-lg font-semibold mb-3">
              Reject Event
            </h2>

            <textarea
              placeholder="Write reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">

              <button onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};