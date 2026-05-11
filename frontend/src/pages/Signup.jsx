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
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { user, registerUser, googleLogin, resendVerificationEmail } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setLoading(false);
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
      await registerUser({ name, email, password });
      setVerificationSent(true);
      showToast({
        type: "success",
        message: "Verification email sent. Check your inbox before logging in.",
      });
    } catch (error) {
      showToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      if (!email || !password) {
        showToast({
          type: "error",
          message: "Keep your email and password filled to resend verification.",
        });
        return;
      }

      setLoading(true);
      const result = await resendVerificationEmail({ email, password });

      showToast({
        type: result.alreadyVerified ? "success" : "info",
        message: result.alreadyVerified
          ? "Your email is already verified. You can login now."
          : "Verification email sent again. Please check your inbox or spam folder.",
      });
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
          {verificationSent
            ? "Open the email from Firebase and click the verification link"
            : "Join Rupayon for exclusive borka collections"}
        </p>

        {verificationSent && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold">Verification email sent to:</p>
            <p className="mt-1 break-all">{email}</p>
            <p className="mt-3 text-green-700">
              After clicking the link in your email, return here and login with
              the same email and password.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="flex-1 rounded border border-green-700 px-3 py-2 font-medium text-green-800 hover:bg-green-100 disabled:opacity-50"
              >
                Resend Email
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 rounded bg-black px-3 py-2 font-medium text-white hover:bg-gray-800"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

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
