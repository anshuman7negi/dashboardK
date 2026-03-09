import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Star,
    MapPin
} from "lucide-react";
import { DestinationReviews } from "../review/DestinationReviews";
import { approveDestination, fetchDestinationDetail, rejectDestination, type DestinationDetailResponse } from "../../services/adminDestinationApi";
import toast from "react-hot-toast";




export const DestinationDetail = () => {

    const { id } = useParams();

    const [destination, setDestination] =
        useState<DestinationDetailResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [showAddress, setShowAddress] = useState(false);

    const [activeImage, setActiveImage] =
        useState<string | null>(null);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState(false);


    useEffect(() => {
        if (!id) return;

        fetchDestinationDetail(Number(id))
            .then((data) => {

                setDestination(data);

                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }

            })
            .finally(() => setLoading(false));

    }, [id]);


    const handleApprove = async () => {

        if (!destination) return;

        try {

            setProcessing(true);

            await approveDestination(destination.id);

            toast.success("Destination successfully approved");

        } catch (err: any) {

            toast.error(err?.message || "Approval failed");

        } finally {

            setProcessing(false);

        }

    };

    const handleReject = async () => {

        if (!destination || !rejectReason.trim()) return;

        try {

            setProcessing(true);

            await rejectDestination(destination.id, rejectReason);

            toast.success("Destination rejected");

            setShowRejectModal(false);
            setRejectReason("");

        } catch (err: any) {

            toast.error(err?.message || "Rejection failed");

        } finally {

            setProcessing(false);

        }

    };

    if (loading) {
        return (<div className="max-w-6xl mx-auto py-10 px-4 animate-pulse">

            <div className="h-10 bg-gray-200 w-1/3 rounded mb-6" />

            <div className="grid md:grid-cols-3 gap-6">

                <div className="md:col-span-2 h-[400px] bg-gray-200 rounded-2xl" />

                <div className="h-[400px] bg-gray-200 rounded-2xl" />

            </div>

        </div>
        );

    }

    if (!destination) {
        return (<div className="p-10 text-center">
            Destination not found </div>
        );
    }

    const youtubeEmbed =
        destination.youtubeVideoUrl?.replace(
            "youtu.be/",
            "youtube.com/embed/"
        ) || "";

    const openMap = () => {

        if (!destination.latitude || !destination.longitude) return;

        window.open(
            `https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`,
            "_blank"
        );


    };

    return (<div className="max-w-6xl mx-auto py-10 px-4">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

                <h1 className="text-3xl md:text-4xl font-bold">
                    {destination.name}
                </h1>

                <p className="text-gray-500 mt-1">
                    {destination.shortDescription}
                </p>

            </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* IMAGES */}

            <div className="lg:col-span-2 flex flex-col">

                {activeImage && (

                    <div className="w-full aspect-video">

                        <img
                            src={activeImage}
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />

                    </div>

                )}

                {/* THUMBNAILS */}

                <div className="flex gap-3 mt-4 overflow-x-auto">

                    {(destination.images || []).map((img, index) => (

                        <img
                            key={index}
                            src={img}
                            onClick={() => setActiveImage(img)}
                            className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200
            ${activeImage === img
                                    ? "border-orange-500 scale-105"
                                    : "border-transparent hover:scale-105"
                                }`}
                        />

                    ))}

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="flex flex-col gap-6">

                {/* YOUTUBE */}

                <div>

                    {youtubeEmbed ? (

                        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border bg-white">

                            <iframe
                                className="w-full h-full"
                                src={youtubeEmbed}
                                title="YouTube video"
                                allowFullScreen
                            />

                        </div>

                    ) : (

                        <div className="w-full aspect-video flex items-center justify-center bg-gray-100 rounded-2xl border">
                            <span className="text-gray-400">
                                No video available
                            </span>
                        </div>

                    )}

                </div>

                {/* INFO CARD */}

                <div className="bg-white rounded-2xl shadow-lg border p-5">

                    {/* WEATHER */}

                    {/* {weather?.main && (

          <div className="flex items-center gap-3 mb-4">

            <CloudSun className="text-orange-500" />

            <div>

              <p className="font-semibold">
                {weather.main.temp}°C
              </p>

              <p className="text-xs text-gray-500 capitalize">
                {weather.weather?.[0]?.description}
              </p>

            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 ml-auto">

              <Wind size={14} />
              {weather.wind?.speed} km/h

            </div>

          </div>

        )} */}

                    {/* ACTIONS */}

                    <div className="flex items-center gap-3">

                        <button
                            onClick={openMap}
                            className="w-11 h-11 rounded-full flex items-center justify-center
            bg-gradient-to-r from-orange-500 to-green-500
            text-white shadow-lg"
                        >
                            <MapPin size={18} />
                        </button>

                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="px-4 py-2 rounded-xl text-sm font-medium
            bg-white shadow-md border hover:shadow-lg"
                        >
                            View Address
                        </button>

                        <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-xl border">

                            <Star className="text-orange-500" size={16} />

                            <span className="font-semibold text-sm">
                                {destination.averageRating ?? 0}
                            </span>

                            <span className="text-xs text-gray-500">
                                /{destination.reviewCount ?? 0}
                            </span>

                        </div>

                    </div>

                    {/* ADDRESS */}

                    {showAddress && (

                        <div className="mt-4 border-t pt-3 text-sm text-gray-700">

                            <p className="font-medium">
                                {destination.address}
                            </p>

                            <p className="text-gray-500">
                                Pincode: {destination.pincode}
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

        {/* DESCRIPTION */}

        <div className="mt-10">

            <h2 className="text-2xl font-semibold mb-3">
                Description
            </h2>

            <p className="text-gray-700 leading-relaxed">
                {destination.fullDescription}
            </p>

        </div>


        {destination.status === "PENDING" && (

            <div className="flex gap-4 mt-8">

                <button
                    onClick={handleApprove}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:scale-105 transition"
                >

                    Approve

                </button>

                <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:scale-105 transition"
                >

                    Reject

                </button>

                {showRejectModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

                        <div className="w-[420px] bg-white rounded-3xl shadow-2xl p-7 animate-[fadeIn_.2s_ease]">

                            <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                Reject Destination
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                Provide a reason for rejecting this destination.
                            </p>

                            <textarea
                                placeholder="Write rejection remark..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="
            w-full
            border
            border-gray-200
            focus:border-red-500
            focus:ring-2
            focus:ring-red-100
            rounded-xl
            p-3
            text-sm
            outline-none
            transition
            resize-none
            mb-6
            "
                                rows={4}
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="
                px-5 py-2
                text-sm
                rounded-xl
                border
                border-gray-200
                hover:bg-gray-100
                transition
                "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleReject}
                                    disabled={processing}
                                    className="
                px-5 py-2
                text-sm
                rounded-xl
                text-white
                bg-red-600
                hover:bg-red-700
                shadow-md
                hover:shadow-lg
                transition
                disabled:opacity-50
                "
                                >
                                    {processing ? "Rejecting..." : "Reject"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        )}

        {destination.status === "APPROVED" && (
            <DestinationReviews destinationId={destination.id} />
        )}

        {destination.status === "REJECTED" && destination.adminRemark && (

            <div className="mt-8">

                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">

                    <div className="flex items-start gap-3">

                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold">
                            !
                        </div>

                        <div>

                            <h3 className="text-red-700 font-semibold text-lg">
                                Destination Rejected
                            </h3>

                            <p className="text-sm text-red-600 mt-1">
                                This destination submission was rejected by the admin.
                            </p>

                            <div className="mt-3 bg-white border border-red-100 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">

                                {destination.adminRemark}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        )}

    </div>

    );
};



