import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* Watermark Background */}
      <div className="absolute inset-0 rotate-[-18deg] opacity-[0.05] text-[120px] font-bold text-orange-600 select-none pointer-events-none flex flex-wrap gap-32 p-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i}>Krowdless</span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-6 rounded-full">
            <AlertTriangle size={48} className="text-orange-600" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
          404
        </h1>

        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/admin")}
          className="px-8 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition shadow-lg"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
