import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex">

      {/* Left Branding Section */}
      <div className="hidden md:flex relative w-1/2 bg-gradient-to-br from-orange-500 to-pink-500 text-white overflow-hidden">

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 rotate-[-20deg] scale-150 opacity-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, row) => (
            <div
              key={row}
              className="whitespace-nowrap animate-marquee"
              style={{ marginBottom: "40px" }}
            >
              Krowdless &nbsp; Krowdless &nbsp; Krowdless &nbsp;
              Krowdless &nbsp; Krowdless &nbsp; Krowdless &nbsp;
              Krowdless &nbsp; Krowdless &nbsp; Krowdless
            </div>
          ))}
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-6">
            Join Krowdless
          </h1>

          <p className="text-lg leading-relaxed mb-6">
            Start managing your travel agency with smart tools,
            advanced analytics, and full control over your team.
          </p>

          <ul className="space-y-3 text-sm">
            <li>✔ Create & manage packages</li>
            <li>✔ Control employee permissions</li>
            <li>✔ Track revenue & bookings</li>
            <li>✔ Scale your travel business</li>
          </ul>
        </div>

      </div>

      {/* Signup Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg mb-6 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <button
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-orange-500 font-medium"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Signup;
