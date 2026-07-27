import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      // Backend expects "email" — username field maps to it
      const data = await login(username, password);
      if (data.status === "success") {
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="w-full h-full bg-slate-50/95 backdrop-blur-md rounded-[36px] p-8 lg:p-12 shadow-2xl border border-white/20 flex flex-col justify-center">
  <div className="text-center mb-8">
    <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
      Admin <span className="text-red-600">Login</span>
    </h2>
    <p className="text-sm text-slate-500 mt-2">
      Welcome back! Please login to continue.
    </p>
  </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-1.5">
            <User size={16} />
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800 mb-1.5">
            <Lock size={16} />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-start">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white text-sm font-semibold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
          <LogIn size={18} />
        </button>
      </form>
    </div>
  );
};

export default LoginForm;