import {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    getTravelPackages,
    type TravelPackageListResponse,
    type TravelPackageStatus,
    TRAVEL_PACKAGE_STATUS

} from "../../services/TravelPackageService";
import { useNavigate } from "react-router-dom";

export const TravelPackagesCenterPage = () => {

    const [loading, setLoading] =
        useState(true);

    const [packages, setPackages] =
        useState<
            TravelPackageListResponse[]
        >([]);

    const [title, setTitle] =
        useState("");

    const navigate = useNavigate();

    const [
        startingLocation,
        setStartingLocation
    ] = useState("");

    const [status, setStatus] =
        useState<
            TravelPackageStatus | ""
        >("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const fetchPackages = async () => {

        try {

            setLoading(true);

            const response =
                await getTravelPackages({

                    title:
                        title || undefined,

                    startingLocation:
                        startingLocation || undefined,

                    status:
                        status || undefined,

                    maxActualPrice:
                        maxPrice
                            ? Number(maxPrice)
                            : undefined,

                    page: 0,

                    size: 25
                });

            setPackages(
                response.content
            );

        } catch {

            toast.error(
                "Failed to load travel packages"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    return (

        <section className="max-w-7xl mx-auto">

            {/* HEADER */}

            <div className="mb-10">

                <h1 className="text-4xl font-black text-slate-900">
                    Travel Packages
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage and review
                    travel packages.
                </p>

            </div>

            {/* FILTERS */}

            <div
                className="bg-white rounded-[32px]
        shadow-sm border border-slate-100
        p-6 mb-8"
            >

                <div
                    className="grid grid-cols-1
          md:grid-cols-2 xl:grid-cols-5
          gap-5"
                >

                    <input
                        placeholder="Search title..."
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        className="h-14 rounded-2xl
            border border-slate-200
            px-5 outline-none
            focus:ring-2
            focus:ring-orange-500"
                    />

                    <input
                        placeholder="Starting location"
                        value={startingLocation}
                        onChange={(e) =>
                            setStartingLocation(
                                e.target.value
                            )
                        }
                        className="h-14 rounded-2xl
            border border-slate-200
            px-5 outline-none
            focus:ring-2
            focus:ring-orange-500"
                    />

                    <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(
                                e.target.value
                            )
                        }
                        className="h-14 rounded-2xl
            border border-slate-200
            px-5 outline-none
            focus:ring-2
            focus:ring-orange-500"
                    />

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value as TravelPackageStatus
                            )
                        }
                        className="h-14 rounded-2xl
            border border-slate-200
            px-5 outline-none
            focus:ring-2
            focus:ring-orange-500"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value={TRAVEL_PACKAGE_STATUS.PENDING}>
                            Pending
                        </option>

                        <option value={TRAVEL_PACKAGE_STATUS.APPROVED}>
                            Approved
                        </option>

                        <option value={TRAVEL_PACKAGE_STATUS.REJECTED}>
                            Rejected
                        </option>

                    </select>

                    <button
                        onClick={fetchPackages}
                        className="h-14 rounded-2xl
            bg-black text-white
            font-semibold hover:scale-[1.02]
            transition"
                    >
                        Apply Filters
                    </button>

                </div>

            </div>

            {/* LIST */}

            {loading ? (

                <div className="text-center py-20">
                    Loading...
                </div>

            ) : packages.length === 0 ? (

                <div
                    className="bg-white rounded-3xl
          p-16 text-center"
                >

                    <p className="text-slate-500">
                        No travel packages found.
                    </p>

                </div>

            ) : (

                <div
                    className="grid grid-cols-1
          md:grid-cols-2 xl:grid-cols-3
          gap-8"
                >

                    {packages.map((pkg) => (

                        <div
                            key={pkg.id}
                            onClick={() => navigate(`/admin/travel-packages/${pkg.id}`)}
                            className="bg-white rounded-[32px]
              overflow-hidden border
              border-slate-100 shadow-sm
              hover:shadow-xl transition"
                        >

                            <div className="h-64">

                                <img
                                    src={pkg.thumbnailUrl}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover"
                                />

                            </div>

                            <div className="p-6">

                                <h2
                                    className="text-2xl
                  font-bold text-slate-900"
                                >
                                    {pkg.title}
                                </h2>

                                <div
                                    className="flex items-center
                  gap-3 mt-3 flex-wrap"
                                >

                                    <span
                                        className="px-3 py-1
                    rounded-full bg-orange-50
                    text-orange-600 text-sm"
                                    >
                                        {pkg.durationDays}D /
                                        {" "}
                                        {pkg.durationNights}N
                                    </span>

                                    <span
                                        className="px-3 py-1
                    rounded-full bg-slate-100
                    text-slate-600 text-sm"
                                    >
                                        {pkg.startingLocation}
                                    </span>

                                </div>

                                <div className="mt-5">

                                    <p className="text-3xl font-black">
                                        ₹{pkg.earlyBirdPrice ??
                                            pkg.actualPrice}
                                    </p>

                                    {pkg.earlyBirdPrice && (

                                        <p
                                            className="text-sm
                      text-slate-400
                      line-through mt-1"
                                        >
                                            ₹{pkg.actualPrice}
                                        </p>
                                    )}

                                </div>

                                <div
                                    className="mt-5 flex
                  justify-between text-sm
                  text-slate-500"
                                >

                                    <span>
                                        {pkg.startDate}
                                    </span>

                                    <span>
                                        {pkg.endDate}
                                    </span>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </section>
    );
}