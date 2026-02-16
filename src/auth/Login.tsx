import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role.toLowerCase() === "admin") {
      navigate("/admin");
    } else if (role.toLowerCase() === "agent") {
      navigate("/agent");
    } else {
      alert("Enter admin or agent");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Branding Section */}
<div className="hidden md:flex relative w-1/2 bg-gradient-to-br from-orange-500 to-pink-500 text-white overflow-hidden">

  {/* Background Pattern */}
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
      Krowdless Ops
    </h1>

    <p className="text-lg leading-relaxed mb-6">
      Manage your travel business with complete control.
      Packages, employees, approvals, revenue —
      everything in one powerful dashboard.
    </p>

    <ul className="space-y-3 text-sm">
      <li>✔ Multi-agent management</li>
      <li>✔ Role-based permissions</li>
      <li>✔ Revenue analytics</li>
      <li>✔ Secure admin controls</li>
    </ul>

  </div>

</div>



      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Welcome Back
          </h2>

          <input
            type="text"
            placeholder="Enter role (admin / agent)"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Login
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 font-medium"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
