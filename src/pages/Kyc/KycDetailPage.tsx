import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";
import {
  getKycDetail,
  verifyKyc,
  type KycDetailResponse,
} from "../../services/kycAdmin";

export const KycDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [rejectModal, setRejectModal] = useState(false);

  const [reason, setReason] = useState("");

  const [kyc, setKyc] = useState<KycDetailResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    getKycDetail(Number(id))
      .then((res) => {
        setKyc(res);
      })

      .catch(() => {
        toast.error("Failed to load KYC detail");
      })

      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    if (!kyc) return;

    try {
      await verifyKyc({
        kycId: kyc.kycId,

        status: "APPROVED",
      });

      toast.success("KYC approved successfully");

      navigate("/admin/verify-kyc");
    } catch {
      toast.error("Failed to approve KYC");
    }
  };

  const handleReject = async () => {
    if (!kyc) return;

    try {
      await verifyKyc({
        kycId: kyc.kycId,

        status: "REJECTED",

        rejectionReason: reason,
      });

      toast.success("KYC rejected");

      navigate("/admin/verify-kyc");
    } catch {
      toast.error("Failed to reject KYC");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (!kyc) return null;

  return (
    <section className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <button
              onClick={() => navigate("/admin/verify-kyc")}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-3"
            >
              ← Back to KYC Center
            </button>

            <h1 className="text-3xl font-bold text-gray-900">
              KYC Verification
            </h1>

            <p className="text-gray-500 mt-2">
              Review submitted documents and verify user identity.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Badge */}

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold
        ${
          kyc.status === "APPROVED"
            ? "bg-green-100 text-green-700"
            : kyc.status === "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
        }`}
            >
              {kyc.status}
            </span>

            <button
              onClick={handleApprove}
              className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              ✓ Approve
            </button>

            <button
              onClick={() => setRejectModal(true)}
              className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
            >
              ✕ Reject
            </button>
          </div>
        </div>
      </div>

      {kyc.status === "REJECTED" && (
        <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-700">KYC Rejected</h2>

              <p className="text-sm text-red-500 mt-1">
                This verification request was rejected by the administrator.
              </p>

              <div className="mt-5 rounded-2xl bg-white border border-red-100 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                  Rejection Reason
                </p>

                <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                  {kyc.rejectionReason || "No reason provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRID */}

     <div className="space-y-8">

  {/* Personal + Business Card */}
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        {/* LEFT */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Personal Details */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              👤 Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Full Name" value={kyc.fullName} />

              <Info label="Mobile Number" value={kyc.mobileNumber} />

              <Info label="Email Address" value={kyc.email} />

              <Info label="PAN Number" value={kyc.panNumber} />

              <Info label="Aadhaar Number" value={kyc.aadhaarNumber} />
            </div>
          </div>

          {/* Business Details */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              🏢 Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Business Name" value={kyc.businessName || "-"} />

              <Info label="GST Number" value={kyc.gstNumber || "-"} />

              <Info label="Bank Account" value={kyc.bankAccountNumber} />

              <Info label="IFSC Code" value={kyc.ifscCode} />
            </div>
          </div>
        </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"></div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📄 Uploaded Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kyc.documents.map((doc) => (
              <div
                key={doc.documentType}
                className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition duration-300"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    {doc.documentType}
                  </h3>

                  <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                    Verified Copy
                  </span>
                </div>

                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={doc.fileUrl}
                    alt={doc.documentType}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4 flex gap-3">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-2 font-medium transition"
                  >
                    View Full
                  </a>

                  <a
                    href={doc.fileUrl}
                    download
                    className="flex-1 text-center rounded-xl border border-gray-300 hover:bg-gray-100 py-2 font-medium transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>



      {/* REJECT MODAL */}

      {rejectModal && (
        <div
          className="fixed inset-0 z-50
          bg-black/40 backdrop-blur-sm
          flex items-center justify-center"
        >
          <div
            className="bg-white rounded-3xl
            p-8 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Reject KYC</h2>

            <textarea
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-36 rounded-2xl
              border border-gray-300 p-4
              outline-none focus:ring-2
              focus:ring-red-500"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setRejectModal(false)}
                className="px-5 py-2 rounded-xl
                border"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-xl
                bg-red-600 text-white"
              >
                Reject KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

    <p className="mt-2 text-base font-semibold text-gray-900 break-words">
      {value || "-"}
    </p>
  </div>
);
