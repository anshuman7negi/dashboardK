import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import {
    fetchAdminEvents,
    approveEvent,
    rejectEvent,
} from "../../services/adminEventApi";
import { useNavigate } from "react-router-dom";

type Status = "PENDING" | "APPROVED" | "REJECTED";

export const ApproveRejectEvents: React.FC = () => {

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<Status>("PENDING");

    const [keyword, setKeyword] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [events, setEvents] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterOpen, setFilterOpen] = useState(false);

    const navigate = useNavigate();

    /* ================= LOAD EVENTS ================= */
    const loadEvents = () => {
        setLoading(true);

        fetchAdminEvents({
            status,
            keyword: keyword || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
            page,
            size: 10,
        })
            .then((res) => {
                setEvents(res.content);
                setTotalPages(res.totalPages);
            })
            .catch(() => toast.error("Failed to load events"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadEvents();
    }, [status, page]);

    /* ================= ACTIONS ================= */

    const handleApprove = async (id: number) => {
        try {
            await approveEvent(id);
            toast.success("Event approved");
            loadEvents();
        } catch {
            toast.error("Failed to approve");
        }
    };

    const handleReject = async (id: number) => {
        const remark = prompt("Enter rejection reason");
        if (!remark) return;

        try {
            await rejectEvent(id, remark);
            toast.success("Event rejected");
            loadEvents();
        } catch {
            toast.error("Failed to reject");
        }
    };

    return (
        <section className="py-10 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Event Review</h1>

                    <button
                        onClick={() => setFilterOpen((p) => !p)}
                        className="px-5 py-2 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-full shadow"
                    >
                        Filters
                    </button>
                </div>

                {/* FILTER PANEL */}
                {filterOpen && (
                    <div className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                            className="border px-3 py-2 rounded-lg"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        <input
                            placeholder="Search event..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="border px-3 py-2 rounded-lg w-full"
                        />

                        <div className="flex gap-4">
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-2 rounded-lg" />
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-2 rounded-lg" />
                        </div>

                        <button
                            onClick={() => {
                                setPage(0);
                                loadEvents();
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Apply Filters
                        </button>

                    </div>
                )}

                {/* ================= CONTENT ================= */}

                {/* SKELETON */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl animate-pulse">
                                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                                <div className="h-5 bg-gray-200 mb-2 w-3/4"></div>
                                <div className="h-4 bg-gray-200 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY */}
                {!loading && events.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        😴 No events found
                    </div>
                )}

                {/* EVENTS */}
                {!loading && events.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {events.map((e) => (
                            <div key={e.id} onClick={() => navigate(`/admin/event/${e.id}`)} className="bg-white rounded-xl shadow-lg overflow-hidden">

                                <img
                                    src="https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg"
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-6">

                                    <h3 className="text-xl font-bold">{e.title}</h3>

                                    <p className="text-gray-600 mt-2 line-clamp-2">
                                        {e.desc}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                                        <Calendar className="w-4 h-4" />
                                        {e.starteventdate} → {e.endeventdate}
                                    </div>

                                    {status === "PENDING" && (
                                        <div className="flex gap-3 mt-5">

                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleApprove(e.id);
                                                }}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleReject(e.id);
                                                }}
                                                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                                            >
                                                Reject
                                            </button>

                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}

                    </div>
                )}

                {/* PAGINATION */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-10 gap-4">

                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-4 py-2 bg-white shadow rounded"
                        >
                            Prev
                        </button>

                        <span className="px-4 py-2 bg-orange-500 text-white rounded">
                            {page + 1}
                        </span>

                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-white shadow rounded"
                        >
                            Next
                        </button>

                    </div>
                )}

            </div>
        </section>
    );
};