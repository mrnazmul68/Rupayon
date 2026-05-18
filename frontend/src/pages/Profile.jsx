import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCamera,
  FiLogOut,
  FiMail,
  FiSave,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { uploadApi, usersApi } from "../services/api.js";

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

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Profile = () => {
  const {
    user,
    dbUser,
    loading,
    logoutUser,
    refreshDbUser,
    setDbUser,
  } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
  });

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: dbUser?.name || user.displayName || "",
      phone: dbUser?.phone || user.phoneNumber || "",
      avatar: dbUser?.avatar || user.photoURL || "",
      street: dbUser?.address?.street || "",
      city: dbUser?.address?.city || "",
      state: dbUser?.address?.state || "",
      postalCode: dbUser?.address?.postalCode || "",
      country: dbUser?.address?.country || "Bangladesh",
    });
    setPicturePreview("");
    setPictureFile(null);
  }, [dbUser, user]);

  const profileImage = picturePreview || formData.avatar;
  const profileInitial = useMemo(
    () => formData.name?.charAt(0) || user?.email?.charAt(0) || "U",
    [formData.name, user?.email]
  );
  const provider = user?.providerData?.[0];

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!dbUser?._id) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      let avatar = formData.avatar;
      if (pictureFile) {
        const base64 = await fileToBase64(pictureFile);
        const uploadResult = await uploadApi.images([base64]);
        avatar = uploadResult.images?.[0]?.url || avatar;
      }

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        avatar,
        markActivity: true,
        activityMessage: "User updated profile",
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim() || "Bangladesh",
        },
      };

      const response = await usersApi.update(dbUser._id, payload);
      setDbUser(response.user);
      await refreshDbUser?.();
      setPictureFile(null);
      setPicturePreview("");
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="min-h-screen pt-16 bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full object-cover overflow-hidden bg-gray-100 border flex items-center justify-center text-4xl font-semibold uppercase">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={formData.name || "Profile"}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                profileInitial
              )}
            </div>
            <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer hover:bg-gray-800">
              <FiCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-xl font-semibold text-center">
            {formData.name || "Rupayon Customer"}
          </h2>
          <p className="text-gray-500 text-sm text-center break-all">
            {user.email}
          </p>

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
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold">Profile Details</h3>
                <p className="text-sm text-gray-500">
                  These details will be used to fill checkout in one tap.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving || !dbUser?._id}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50"
              >
                <FiSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {message && (
              <p className="mb-4 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-500">Full Name</span>
                <input
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">Phone</span>
                <input
                  value={formData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="+880 1XXXXXXXXX"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm text-gray-500">Address</span>
                <input
                  value={formData.street}
                  onChange={(event) => handleChange("street", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="House, road, area"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">City</span>
                <input
                  value={formData.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="Dhaka"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">Postal Code</span>
                <input
                  value={formData.postalCode}
                  onChange={(event) => handleChange("postalCode", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="1200"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">State</span>
                <input
                  value={formData.state}
                  onChange={(event) => handleChange("state", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="Optional"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">Country</span>
                <input
                  value={formData.country}
                  onChange={(event) => handleChange("country", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:border-black"
                  placeholder="Bangladesh"
                />
              </label>
            </div>
          </form>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              Your saved profile details will prefill checkout after your first
              order. You can still edit them before placing any order.
            </p>
            <Link
              to="/profile/orders"
              className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
