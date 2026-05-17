import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
    MapPin,
    CalendarDays,
    Clock3,
    IndianRupee,
    FileText
} from "lucide-react";

import toast from "react-hot-toast";

import {

    approveTravelPackage,

    fetchTravelPackageDetail,

    rejectTravelPackage,

    type TravelPackageDetailResponse

} from "../../services/TravelPackageService";

export const TravelPackageDetailPage = () => {

    const { id } = useParams();

    const [travelPackage, setTravelPackage] =
        useState<TravelPackageDetailResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] =
        useState<string | null>(null);

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectRemark, setRejectRemark] =
        useState("");

    const [processing, setProcessing] =
        useState(false);

    useEffect(() => {

        if (!id) return;

        fetchTravelPackageDetail(Number(id))
            .then((data) => {

                setTravelPackage(data);

                if (data.imageUrls?.length > 0) {
                    setActiveImage(data.imageUrls[0]);
                }

            })
            .finally(() => setLoading(false));

    }, [id]);

    const handleApprove = async () => {

        if (!travelPackage) return;

        try {

            setProcessing(true);

            await approveTravelPackage(
                travelPackage.id
            );

            toast.success(
                "Travel package approved"
            );

            setTravelPackage({
                ...travelPackage,
                status: "APPROVED"
            });

        } catch (e: any) {

            toast.error(
                e?.response?.data?.message ||
                "Approval failed"
            );

        } finally {

            setProcessing(false);

        }
    };

    const handleReject = async () => {

        if (
            !travelPackage ||
            !rejectRemark.trim()
        ) return;

        try {

            setProcessing(true);

            await rejectTravelPackage(
                travelPackage.id,
                rejectRemark
            );

            toast.success(
                "Travel package rejected"
            );

            setTravelPackage({
                ...travelPackage,
                status: "REJECTED",
                adminRemark: rejectRemark
            });

            setShowRejectModal(false);

            setRejectRemark("");

        } catch (e: any) {

            toast.error(
                e?.response?.data?.message ||
                "Rejection failed"
            );

        } finally {

            setProcessing(false);

        }
    };

    if (loading) {

        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    if (!travelPackage) {

        return (
            <div className="p-10">
                Package not found
            </div>
        );
    }

    return (

        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-4xl font-black text-slate-800">
                    {travelPackage.title}
                </h1>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">

                    <div className="flex items-center gap-2">

                        <MapPin size={16} />

                        {travelPackage.startingLocation}
                        {" → "}
                        {travelPackage.endingLocation}

                    </div>

                    <div className="flex items-center gap-2">

                        <Clock3 size={16} />

                        {travelPackage.durationDays} Days /
                        {" "}
                        {travelPackage.durationNights} Nights

                    </div>

                    <div className="flex items-center gap-2">

                        <CalendarDays size={16} />

                        {travelPackage.startDate}

                    </div>

                </div>

            </div>

            {/* MAIN */}

            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT */}

                <div className="lg:col-span-2">

                    {/* MAIN IMAGE */}

                    {activeImage && (

                        <img
                            src={activeImage}
                            className="
              w-full
              aspect-video
              object-cover
              rounded-3xl
              shadow-xl
              "
                        />

                    )}

                    {/* THUMBNAILS */}

                    <div className="flex gap-3 mt-4 overflow-x-auto">

                        {travelPackage.imageUrls?.map(
                            (img, index) => (

                                <img
                                    key={index}
                                    src={img}
                                    onClick={() =>
                                        setActiveImage(img)
                                    }
                                    className={`
                  w-28
                  h-20
                  object-cover
                  rounded-2xl
                  cursor-pointer
                  border-2
                  transition-all
                  ${activeImage === img
                                            ? "border-orange-500 scale-105"
                                            : "border-transparent"
                                        }
                  `}
                                />

                            )
                        )}

                    </div>

                    {/* OVERVIEW */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Overview
                        </h2>

                        <p className="text-slate-600 leading-8">
                            {travelPackage.overview}
                        </p>

                    </div>

                    {/* ITINERARY */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Brief Itinerary
                        </h2>

                        <p className="text-slate-600 leading-8 whitespace-pre-line">
                            {travelPackage.briefItinerary}
                        </p>

                    </div>

                    {/* INCLUSIONS */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Inclusions
                        </h2>

                        <p className="text-slate-600 whitespace-pre-line">
                            {travelPackage.inclusions}
                        </p>

                    </div>

                    {/* EXCLUSIONS */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Exclusions
                        </h2>

                        <p className="text-slate-600 whitespace-pre-line">
                            {travelPackage.exclusions}
                        </p>

                    </div>

                    {/* THINGS */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Things To Carry
                        </h2>

                        <p className="text-slate-600 whitespace-pre-line">
                            {travelPackage.thingsToCarry}
                        </p>

                    </div>

                    {/* POLICY */}

                    <div className="mt-10">

                        <h2 className="text-2xl font-bold mb-4">
                            Cancellation Policy
                        </h2>

                        <p className="text-slate-600 whitespace-pre-line">
                            {travelPackage.cancellationPolicy}
                        </p>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-6">

                    {/* PRICE CARD */}

                    <div className="
          bg-white
          rounded-3xl
          border
          shadow-lg
          p-6
          ">

                        <div className="flex items-center gap-2 mb-4">

                            <IndianRupee
                                className="text-green-600"
                            />

                            <h3 className="text-xl font-bold">
                                Pricing
                            </h3>

                        </div>

                        <div className="space-y-3">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Actual Price
                                </p>

                                <p className="text-3xl font-black">
                                    ₹{travelPackage.actualPrice}
                                </p>

                            </div>

                            {travelPackage.earlyBirdPrice && (

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Early Bird
                                    </p>

                                    <p className="text-2xl font-bold text-orange-500">
                                        ₹{travelPackage.earlyBirdPrice}
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                    {/* BROCHURE */}

                    {travelPackage.brochurePdfUrl && (

                        <a
                            href={travelPackage.brochurePdfUrl}
                            target="_blank"
                            className="
              flex
              items-center
              gap-3
              bg-white
              rounded-3xl
              border
              p-5
              shadow-lg
              hover:scale-[1.02]
              transition
              "
                        >

                            <FileText />

                            <span className="font-semibold">
                                Download Brochure
                            </span>

                        </a>

                    )}

                    {/* STATUS */}

                    <div className="
          bg-white
          rounded-3xl
          border
          shadow-lg
          p-6
          ">

                        <h3 className="font-bold mb-4">
                            Status
                        </h3>

                        <div className="
            inline-flex
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
            bg-orange-100
            text-orange-700
            ">

                            {travelPackage.status}

                        </div>

                    </div>

                    {/* ACTIONS */}

                    {travelPackage.status ===
                        "PENDING" && (

                            <div className="flex gap-4">

                                <button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    className="
                flex-1
                py-3
                rounded-2xl
                bg-green-600
                text-white
                font-bold
                "
                                >

                                    Approve

                                </button>

                                <button
                                    onClick={() =>
                                        setShowRejectModal(true)
                                    }
                                    className="
                flex-1
                py-3
                rounded-2xl
                bg-red-600
                text-white
                font-bold
                "
                                >

                                    Reject

                                </button>

                            </div>

                        )}

                    {/* REJECT REMARK */}

                    {travelPackage.status ===
                        "REJECTED" &&
                        travelPackage.adminRemark && (

                            <div className="
              bg-red-50
              border
              border-red-200
              rounded-3xl
              p-5
              ">

                                <h3 className="
                text-red-700
                font-bold
                mb-2
                ">

                                    Rejection Remark

                                </h3>

                                <p className="text-red-600">

                                    {travelPackage.adminRemark}

                                </p>

                            </div>

                        )}

                </div>

            </div>

            {/* REJECT MODAL */}

            {showRejectModal && (

                <div className="
        fixed inset-0
        bg-black/40
        flex items-center
        justify-center
        z-50
        ">

                    <div className="
          bg-white
          w-[420px]
          rounded-3xl
          p-6
          shadow-2xl
          ">

                        <h2 className="
            text-2xl
            font-bold
            mb-4
            ">

                            Reject Travel Package

                        </h2>

                        <textarea
                            value={rejectRemark}
                            onChange={(e) =>
                                setRejectRemark(
                                    e.target.value
                                )
                            }
                            rows={4}
                            placeholder="Write rejection reason..."
                            className="
              w-full
              border
              rounded-2xl
              p-4
              "
                        />

                        <div className="
            flex justify-end
            gap-3
            mt-5
            ">

                            <button
                                onClick={() =>
                                    setShowRejectModal(false)
                                }
                                className="
                px-5 py-2
                border rounded-xl
                "
                            >

                                Cancel

                            </button>

                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="
                px-5 py-2
                rounded-xl
                bg-red-600
                text-white
                "
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