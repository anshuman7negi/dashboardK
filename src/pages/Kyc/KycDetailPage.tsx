import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import toast from "react-hot-toast";
import { getKycDetail, verifyKyc, type KycDetailResponse } from "../../services/kycAdmin";


export const KycDetailPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [rejectModal, setRejectModal] =
    useState(false);

  const [reason, setReason] =
    useState("");

  const [kyc, setKyc] =
    useState<KycDetailResponse | null>(null);

  useEffect(() => {

    if (!id) return;

    getKycDetail(Number(id))

      .then((res) => {
        setKyc(res);
      })

      .catch(() => {
        toast.error(
          "Failed to load KYC detail"
        );
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

        status: "APPROVED"
      });

      toast.success(
        "KYC approved successfully"
      );

      navigate("/admin/verify-kyc");

    } catch {

      toast.error(
        "Failed to approve KYC"
      );
    }
  };

  const handleReject = async () => {

    if (!kyc) return;

    try {

      await verifyKyc({

        kycId: kyc.kycId,

        status: "REJECTED",

        rejectionReason: reason
      });

      toast.success(
        "KYC rejected"
      );

      navigate("/admin/verify-kyc");

    } catch {

      toast.error(
        "Failed to reject KYC"
      );
    }
  };

  if (loading) {

    return (
      <div className="flex justify-center py-20">
        Loading...
      </div>
    );
  }

  if (!kyc) return null;

  return (

    <section className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-3xl font-bold">
            KYC Verification
          </h1>

          <p className="text-gray-500 mt-2">
            Review creator documents and details.
          </p>

        </div>

        <div className="flex gap-4">

          <button
            onClick={handleApprove}
            className="px-6 py-3 rounded-2xl
            bg-green-600 text-white
            font-medium hover:scale-105
            transition"
          >
            Approve
          </button>

          <button
            onClick={() =>
              setRejectModal(true)
            }
            className="px-6 py-3 rounded-2xl
            bg-red-600 text-white
            font-medium hover:scale-105
            transition"
          >
            Reject
          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-xl font-semibold mb-6">
            Personal Information
          </h2>

          <div className="space-y-5">

            <Info
              label="Full Name"
              value={kyc.fullName}
            />

            <Info
              label="Mobile"
              value={kyc.mobileNumber}
            />

            <Info
              label="Email"
              value={kyc.email}
            />

            <Info
              label="PAN Number"
              value={kyc.panNumber}
            />

            <Info
              label="Aadhaar Number"
              value={kyc.aadhaarNumber}
            />

            <Info
              label="Business Name"
              value={kyc.businessName}
            />

            <Info
              label="GST Number"
              value={kyc.gstNumber || "-"}
            />

            <Info
              label="Bank Account"
              value={kyc.bankAccountNumber}
            />

            <Info
              label="IFSC"
              value={kyc.ifscCode}
            />

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {kyc.documents.map((doc) => (

            <div
              key={doc.documentType}
              className="bg-white rounded-3xl
              overflow-hidden shadow-sm"
            >

              <div className="p-5 border-b">

                <h3 className="font-semibold">

                  {doc.documentType}

                </h3>

              </div>

              <div className="aspect-[4/3] bg-gray-100">

                <img
                  src={doc.fileUrl}
                  alt={doc.documentType}
                  className="w-full h-full object-cover"
                />

              </div>

            </div>
          ))}

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

            <h2 className="text-2xl font-bold mb-4">
              Reject KYC
            </h2>

            <textarea
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="w-full h-36 rounded-2xl
              border border-gray-300 p-4
              outline-none focus:ring-2
              focus:ring-red-500"
            />

            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={() =>
                  setRejectModal(false)
                }
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

const Info = ({
  label,
  value
}: {
  label: string;
  value: string;
}) => (

  <div>

    <p className="text-sm text-gray-500">
      {label}
    </p>

    <p className="font-semibold text-gray-900">
      {value}
    </p>

  </div>
);