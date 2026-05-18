import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, registerUser, googleLogin } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      showToast({ type: "success", message: "Login successful" });
      navigate("/");
    }
  }, [user, navigate, showToast]);

  const handleSignup = async () => {
    try {
      if (!name.trim() || !email.trim() || !password) {
        showToast({ type: "error", message: "Please fill all fields" });
        return;
      }

      if (password.length < 6) {
        showToast({
          type: "error",
          message: "Password must be at least 6 characters",
        });
        return;
      }

      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const pendingSignupNames = JSON.parse(
        localStorage.getItem("rupayonSignupNames") || "{}"
      );
      pendingSignupNames[cleanEmail] = name.trim();
      localStorage.setItem("rupayonSignupNames", JSON.stringify(pendingSignupNames));
      await registerUser({ email, password });
      showToast({
        type: "success",
        message: "Account created successfully",
      });
      navigate("/");
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      await googleLogin();
    } catch (err) {
      showToast({ type: "error", message: err.message });
      setLoading(false);
    }
  };

  return (
    <section className="w-full pt-16 py-20 min-h-screen bg-[#fdfcfb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-serif text-center mb-6">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 text-center mb-8">
          Join Rupayon for exclusive borka collections
        </p>

        <div className="mb-4 relative">
          <FaUser className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

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

        <div className="mb-6 relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:border-black"
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 border py-3 rounded hover:bg-gray-100 transition disabled:opacity-50"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already have an account?
          <Link to="/login" className="text-black font-medium">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
