import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStayHostKycDetail,
  verifyStayHostKyc,
  type StayHostKycDetailResponse,
} from "../../services/stayHostKycAdmin";

const StatusBadge = ({ status }: { status: string }) => {
  const color =
    status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : status === "REJECTED"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
      {status}
    </span>
  );
};

export default function StayKycDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [detail, setDetail] = useState<StayHostKycDetailResponse | null>(null);

  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const data = await getStayHostKycDetail(Number(id));

      setDetail(data);
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    if (!detail) return;

    try {
      setSaving(true);

      await verifyStayHostKyc({
        kycId: detail.id,
        status: "APPROVED",
      });

      alert("KYC Approved");

      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  const reject = async () => {
    if (!detail) return;

    if (!reason.trim()) {
      alert("Enter rejection reason");
      return;
    }

    try {
      setSaving(true);

      await verifyStayHostKyc({
        kycId: detail.id,
        status: "REJECTED",
        rejectionReason: reason,
      });

      alert("KYC Rejected");

      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="flex justify-center py-20">Loading...</div>;

  if (!detail)
    return <div className="flex justify-center py-20">KYC Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600">
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow">
        <div className="border-b p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Stay Host KYC Details</h1>

          <StatusBadge status={detail.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <Field label="Full Name" value={detail.fullName} />

          <Field label="PAN Number" value={detail.panNumber} />

          <Field label="Aadhaar Number" value={detail.aadhaarNumber} />

          <Field label="Bank Account Holder" value={detail.bankAccountHolder} />

          <Field label="Bank Account Number" value={detail.bankAccountNumber} />

          <Field label="Bank Name" value={detail.bankName} />

          <Field label="IFSC Code" value={detail.ifscCode} />

          <Field
            label="Submitted At"
            value={new Date(detail.createdAt).toLocaleString()}
          />

          <Field
            label="Verified At"
            value={
              detail.verifiedAt
                ? new Date(detail.verifiedAt).toLocaleString()
                : "-"
            }
          />

          {detail.rejectionReason && (
            <Field label="Rejection Reason" value={detail.rejectionReason} />
          )}
        </div>

        <div className="border-t p-6">
          <h2 className="text-xl font-semibold mb-5">Documents</h2>

          <div className="border-t p-6">
            <h2 className="text-2xl font-bold mb-6">Documents</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <DocumentCard title="PAN Card" image={detail.panImage} />

              <DocumentCard
                title="Aadhaar Front"
                image={detail.aadhaarFrontImage}
              />

              <DocumentCard
                title="Aadhaar Back"
                image={detail.aadhaarBackImage}
              />

              <DocumentCard title="Selfie" image={detail.selfieImage} />
            </div>
          </div>
        </div>

        {detail.status === "PENDING" && (
          <div className="border-t p-6 flex gap-4">
            <button
              disabled={saving}
              onClick={approve}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Approve
            </button>

            <button
              disabled={saving}
              onClick={() => setShowReject(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {showReject && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[450px]">
            <h2 className="text-xl font-bold mb-4">Reject KYC</h2>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Enter rejection reason"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowReject(false)}
                className="border px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={reject}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="font-semibold break-all">{value}</p>
    </div>
  );
}

function DocumentCard({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300">

      <div className="relative h-[340px] bg-gray-100 overflow-hidden">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain bg-gray-100 transition duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3">
          <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {title}
          </span>
        </div>

        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0"
        />
      </div>

      <div className="p-4">

        <h3 className="font-bold text-lg">
          {title}
        </h3>

        <a
          href={image}
          target="_blank"
          rel="noreferrer"
          className="inline-flex mt-3 text-orange-600 font-semibold hover:underline"
        >
          View Full Image →
        </a>

      </div>

    </div>
  );
}