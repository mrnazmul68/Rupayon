import { FiCalendar, FiCheckCircle, FiLogOut, FiMail, FiShield, FiUser } from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const formatDate = (dateString) => {
  if (!dateString) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
};

const getProviderName = (providerId) => {
  if (providerId === "google.com") {
    return "Google";
  }

  if (providerId === "password") {
    return "Email and password";
  }

  return providerId || "Firebase";
};

const Profile = () => {
  const { user, loading, logoutUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 py-10 px-4 md:px-10 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const profileInitial =
    user.displayName?.charAt(0) || user.email?.charAt(0) || "U";
  const provider = user.providerData?.[0];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full object-cover mb-4 overflow-hidden bg-gray-100 border flex items-center justify-center text-4xl font-semibold uppercase">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "Profile"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              profileInitial
            )}
          </div>

          <h2 className="text-xl font-semibold text-center">
            {user.displayName || "Rupayon Customer"}
          </h2>
          <p className="text-gray-500 text-sm text-center break-all">
            {user.email}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.emailVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {user.emailVerified ? "Verified account" : "Email not verified"}
            </span>
          </div>

          <button
            onClick={logoutUser}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            <FiLogOut /> Logout
          </button>

          <div className="w-full mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-gray-600 break-all">
              <FiMail /> {user.email}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FiShield /> {getProviderName(provider?.providerId)}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FiUser /> UID: {user.uid}
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold mt-1">
                  {user.displayName || "Not added"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold mt-1 break-all">{user.email}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold mt-1">
                  {user.phoneNumber || "Not added"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Sign-in Provider</p>
                <p className="font-semibold mt-1">
                  {getProviderName(provider?.providerId)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 p-4 rounded-xl">
                <FiCheckCircle className="mb-2" />
                <p className="text-gray-500">Email Status</p>
                <p className="font-semibold">
                  {user.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl">
                <FiCalendar className="mb-2" />
                <p className="text-gray-500">Created</p>
                <p className="font-semibold">
                  {formatDate(user.metadata?.creationTime)}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-xl">
                <FiCalendar className="mb-2" />
                <p className="text-gray-500">Last Login</p>
                <p className="font-semibold">
                  {formatDate(user.metadata?.lastSignInTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Shopping</h3>
            <p className="text-sm text-gray-600">
              Orders, addresses, and payment methods will appear here after they
              are connected to your backend.
            </p>
            <Link
              to="/products"
              className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
