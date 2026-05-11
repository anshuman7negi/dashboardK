import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
    ShieldCheck,
    Clock3,
    XCircle
} from "lucide-react";
import { getAllKycs, type KycListResponse } from "../../services/kycAdmin";


export const KycCenterPage = () => {

    const [loading, setLoading] =
        useState(true);

    const [kycs, setKycs] =
        useState<KycListResponse[]>([]);

    useEffect(() => {

        getAllKycs()

            .then((res) => {
                setKycs(res);
            })

            .catch(() => {
                toast.error(
                    "Failed to load KYC requests"
                );
            })

            .finally(() => {
                setLoading(false);
            });

    }, []);

    const navigate = useNavigate();

    return (

        <section className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-10">

                    <h1 className="text-3xl font-bold text-gray-900">
                        KYC Center
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review and manage creator verification requests.
                    </p>

                </div>

                {/* LOADING */}

                {loading && (

                    <div className="flex justify-center py-20">

                        <div
                            className="w-12 h-12 border-4
              border-orange-500 border-t-transparent
              rounded-full animate-spin"
                        />

                    </div>
                )}

                {/* EMPTY */}

                {!loading && kycs.length === 0 && (

                    <div
                        className="bg-white rounded-3xl
            p-16 text-center shadow-sm"
                    >

                        <div className="text-6xl mb-4">
                            📭
                        </div>

                        <h3 className="text-xl font-semibold">
                            No KYC Requests
                        </h3>

                        <p className="text-gray-500 mt-2">
                            New verification requests will appear here.
                        </p>

                    </div>
                )}

                {/* GRID */}

                {!loading && kycs.length > 0 && (

                    <div
                        className="grid grid-cols-1
            sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >

                        {kycs.map((kyc) => (

                            <div
                                key={kyc.kycId}
                                onClick={() =>
                                    navigate(`/admin/kyc/${kyc.kycId}`)
                                }
                                className="bg-white rounded-3xl
                overflow-hidden shadow-sm
                hover:shadow-xl transition duration-300
                border border-gray-100"
                            >

                                {/* IMAGE */}

                                <div className="aspect-[4/3] bg-gray-100">

                                    <img
                                        src={kyc.aadhaarDocumentUrl}
                                        alt={kyc.fullName}
                                        className="w-full h-full object-cover"
                                    />

                                </div>

                                {/* CONTENT */}

                                <div className="p-5">

                                    <h2
                                        className="text-lg font-semibold
                    text-gray-900"
                                    >
                                        {kyc.fullName}
                                    </h2>

                                    {/* STATUS */}

                                    <div className="mt-4">

                                        {kyc.status === "PENDING" && (

                                            <div
                                                className="inline-flex items-center gap-2
                        px-4 py-2 rounded-full
                        bg-amber-100 text-amber-700
                        text-sm font-medium"
                                            >

                                                <Clock3 className="w-4 h-4" />

                                                Pending

                                            </div>
                                        )}

                                        {kyc.status === "APPROVED" && (

                                            <div
                                                className="inline-flex items-center gap-2
                        px-4 py-2 rounded-full
                        bg-green-100 text-green-700
                        text-sm font-medium"
                                            >

                                                <ShieldCheck className="w-4 h-4" />

                                                Approved

                                            </div>
                                        )}

                                        {kyc.status === "REJECTED" && (

                                            <div
                                                className="inline-flex items-center gap-2
                        px-4 py-2 rounded-full
                        bg-red-100 text-red-700
                        text-sm font-medium"
                                            >

                                                <XCircle className="w-4 h-4" />

                                                Rejected

                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </section>
    );
};