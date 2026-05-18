import { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const {
    user,
    loginUser,
    googleLogin,
    resetPassword,
  } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      showToast({ type: "success", message: "Login successful" });
      navigate("/");
    }
  }, [user, navigate, showToast]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showToast({
          type: "error",
          message: "Please enter your email and password",
        });
        return;
      }

      setLoading(true);
      await loginUser({ email, password });
      showToast({ type: "success", message: "Login successful" });
      navigate("/");
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!email.trim()) {
        showToast({
          type: "error",
          message: "Please enter your email address first",
        });
        return;
      }

      setResetLoading(true);
      await resetPassword({ email });
      showToast({
        type: "success",
        message: "Password reset link sent. Check your inbox or spam folder.",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleLogin();
    } catch (err) {
      showToast({ type: "error", message: err.message });
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-20 pt-16 min-h-screen bg-[#fdfcfb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-serif text-center mb-6">
          Welcome Back
        </h2>

        <p className="text-sm text-gray-500 text-center mb-8">
          Login to continue shopping at Rupayon
        </p>

        <div className="mb-4 relative">
          <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        <div className="mb-3 relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading || resetLoading}
            className="text-sm font-medium text-black hover:underline disabled:opacity-50"
          >
            {resetLoading ? "Sending reset link..." : "Forgot password?"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 border py-3 rounded hover:bg-gray-100 transition disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Don&apos;t have an account?
          <Link to="/sign-up" className="text-black font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
