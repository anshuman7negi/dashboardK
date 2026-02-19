import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/authApi";
import { setAccessToken } from "../utils/tokenStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(email, password);

      const accessToken = response.data.accessToken;
      const roleArray = response.data.role;

      if (accessToken) {
        setAccessToken(accessToken); // 🔥 memory only
      }

      const role = roleArray?.[0];

      if (role === "ROLE_ADMIN" || role === "ROLE_SUPPORT_ADMIN") {
        navigate("/admin");
      } else if (role === "ROLE_AGENT") {
        navigate("/agent");
      } else {
        setError("Invalid role received from server");
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE BRANDING */}
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
            Welcome Back
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

      {/* RIGHT SIDE FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-8">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Login to your account
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-orange-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD WITH EYE TOGGLE */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full border p-3 pr-12 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

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
