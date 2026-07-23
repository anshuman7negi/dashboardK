import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Clock3,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getStayHostKycs, type KycStatus, type StayHostKycListResponse } from "../../services/stayHostKycAdmin";



export default function StayKycCenterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [status, setStatus] = useState<KycStatus>("PENDING");

  const [kycs, setKycs] = useState<StayHostKycListResponse[]>([]);

  useEffect(() => {
    load();
  }, [page, status]);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getStayHostKycs(status, page, 9);

      setKycs(res.content);

      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load Stay KYCs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stay Host KYC Center</h1>

          <p className="text-gray-500 mt-2">
            Review and verify stay host requests.
          </p>
        </div>

        {/* FILTER */}

        <div className="flex gap-3 mb-8">
          {(["PENDING", "APPROVED", "REJECTED"] as KycStatus[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                setPage(0);

                setStatus(item);
              }}
              className={`px-5 py-2 rounded-full font-medium transition

${
  status === item ? "bg-orange-500 text-white" : "bg-white border text-gray-700"
}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Empty */}

        {!loading && kycs.length === 0 && (
          <div className="bg-white rounded-3xl p-20 text-center">
            <div className="text-6xl">📭</div>

            <h2 className="font-semibold text-xl mt-5">No Stay KYC Found</h2>
          </div>
        )}

        {/* GRID */}

        {!loading && kycs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kycs.map((kyc) => (
                <div
                  key={kyc.id}
                  onClick={() => navigate(`/admin/stay-kyc/${kyc.id}`)}
                  className="cursor-pointer bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition"
                >
                  <div className="aspect-[4/3] bg-gray-100">
                    <img
                      src={kyc.profileImage}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold">{kyc.fullName}</h2>

                    <div className="mt-4">
                      {kyc.status === "PENDING" && (
                        <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
                          <Clock3 size={16} />
                          Pending
                        </div>
                      )}

                      {kyc.status === "APPROVED" && (
                        <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full bg-green-100 text-green-700">
                          <ShieldCheck size={16} />
                          Approved
                        </div>
                      )}

                      {kyc.status === "REJECTED" && (
                        <div className="inline-flex gap-2 items-center px-4 py-2 rounded-full bg-red-100 text-red-700">
                          <XCircle size={16} />
                          Rejected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}

            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-3 rounded-xl border disabled:opacity-40"
              >
                <ChevronLeft />
              </button>

              <div>
                Page {page + 1} of {totalPages}
              </div>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-3 rounded-xl border disabled:opacity-40"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
