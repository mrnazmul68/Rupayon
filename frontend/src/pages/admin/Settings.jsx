import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, uploadApi } from "../../services/api.js";
import { FaUpload, FaImage, FaGlobe, FaUserTie, FaTruck, FaDollarSign, FaCoins, FaShareAlt, FaHome, FaSyncAlt } from "react-icons/fa";

const Settings = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, refetch: refetchSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchSettings();
    setIsRefreshing(false);
  };

  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState(null);
  const [uploadingImages, setUploadingImages] = useState([]);

  React.useEffect(() => {
    if (data?.settings) {
      setFormData(data.settings);
    }
  }, [data]);

  const tabs = [
    { id: "general", label: "General", icon: FaGlobe },
    { id: "hero", label: "Hero Section", icon: FaHome },
    { id: "sections", label: "Sections", icon: FaImage },
    { id: "contact", label: "Contact", icon: FaUserTie },
    { id: "social", label: "Social Links", icon: FaShareAlt },
    { id: "shipping", label: "Shipping", icon: FaTruck },
    { id: "currency", label: "Currency", icon: FaCoins },
  ];

  const updateMutation = useMutation({
    mutationFn: settingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      alert("Settings saved successfully!");
    },
  });

  const handleImageUpload = async (field) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingImages([...uploadingImages, field]);

      try {
        const base64 = await fileToBase64(file);
        const response = await uploadApi.images([base64]);
        const imageUrl = response.urls[0];

        if (field.includes(".")) {
          const [section, key] = field.split(".");
          setFormData({
            ...formData,
            [section]: { ...formData[section], [key]: imageUrl },
          });
        } else {
          setFormData({ ...formData, [field]: imageUrl });
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploadingImages(uploadingImages.filter(f => f !== field));
      }
    };
    input.click();
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!formData) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <FaSyncAlt className={isRefreshing ? "refresh-spin" : ""} />
          Refresh
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={formData.siteName || ""}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                  <input
                    type="text"
                    value={formData.siteDescription || ""}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {formData.siteLogo ? (
                        <img src={formData.siteLogo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <FaImage className="text-gray-400" size={24} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageUpload("siteLogo")}
                      disabled={uploadingImages.includes("siteLogo")}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaUpload />
                      {uploadingImages.includes("siteLogo") ? "Uploading..." : "Upload Logo"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Favicon</label>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {formData.siteFavicon ? (
                        <img src={formData.siteFavicon} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <FaImage className="text-gray-400" size={20} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageUpload("siteFavicon")}
                      disabled={uploadingImages.includes("siteFavicon")}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaUpload />
                      {uploadingImages.includes("siteFavicon") ? "Uploading..." : "Upload Favicon"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={formData.heroSection?.title || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      heroSection: { ...formData.heroSection, title: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={formData.heroSection?.subtitle || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      heroSection: { ...formData.heroSection, subtitle: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.heroSection?.buttonText || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      heroSection: { ...formData.heroSection, buttonText: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.heroSection?.buttonLink || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      heroSection: { ...formData.heroSection, buttonLink: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {formData.heroSection?.heroImage ? (
                        <img src={formData.heroSection.heroImage} alt="Hero" className="w-full h-full object-cover" />
                      ) : (
                        <FaImage className="text-gray-400" size={32} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageUpload("heroSection.heroImage")}
                      disabled={uploadingImages.includes("heroSection.heroImage")}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaUpload />
                      {uploadingImages.includes("heroSection.heroImage") ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {formData.heroSection?.backgroundImage ? (
                        <img src={formData.heroSection.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                      ) : (
                        <FaImage className="text-gray-400" size={32} />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageUpload("heroSection.backgroundImage")}
                      disabled={uploadingImages.includes("heroSection.backgroundImage")}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FaUpload />
                      {uploadingImages.includes("heroSection.backgroundImage") ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sections" && (
            <div className="space-y-8">
              <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">Featured Products Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.featuredSection?.title || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          featuredSection: { ...formData.featuredSection, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.featuredSection?.subtitle || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          featuredSection: { ...formData.featuredSection, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featuredSection?.enabled ?? true}
                        onChange={(e) => setFormData({
                          ...formData,
                          featuredSection: { ...formData.featuredSection, enabled: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Section</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">Best Sellers Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.bestSellerSection?.title || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          bestSellerSection: { ...formData.bestSellerSection, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.bestSellerSection?.subtitle || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          bestSellerSection: { ...formData.bestSellerSection, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.bestSellerSection?.enabled ?? true}
                        onChange={(e) => setFormData({
                          ...formData,
                          bestSellerSection: { ...formData.bestSellerSection, enabled: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Section</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">New Arrivals Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.newArrivalSection?.title || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          newArrivalSection: { ...formData.newArrivalSection, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.newArrivalSection?.subtitle || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          newArrivalSection: { ...formData.newArrivalSection, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.newArrivalSection?.enabled ?? true}
                        onChange={(e) => setFormData({
                          ...formData,
                          newArrivalSection: { ...formData.newArrivalSection, enabled: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Section</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">About Us Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.aboutSection?.title || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          aboutSection: { ...formData.aboutSection, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={4}
                        value={formData.aboutSection?.description || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          aboutSection: { ...formData.aboutSection, description: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">About Image</label>
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                          {formData.aboutSection?.image ? (
                            <img src={formData.aboutSection.image} alt="About" className="w-full h-full object-cover" />
                          ) : (
                            <FaImage className="text-gray-400" size={32} />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageUpload("aboutSection.image")}
                          disabled={uploadingImages.includes("aboutSection.image")}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaUpload />
                          {uploadingImages.includes("aboutSection.image") ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.aboutSection?.enabled ?? true}
                          onChange={(e) => setFormData({
                            ...formData,
                            aboutSection: { ...formData.aboutSection, enabled: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Enable Section</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail || ""}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone || ""}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      value={formData.address?.street || ""}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.address?.city || ""}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.address?.state || ""}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={formData.address?.postalCode || ""}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.address?.country || ""}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.facebook || ""}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.instagram || ""}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.twitter || ""}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.youtube || ""}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, youtube: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Shipping & Tax</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={formData.shipping?.freeShippingThreshold || 0}
                    onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, freeShippingThreshold: Number(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Standard Shipping Rate</label>
                  <input
                    type="number"
                    value={formData.shipping?.standardShippingRate || 0}
                    onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, standardShippingRate: Number(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.tax?.rate || 0}
                    onChange={(e) => setFormData({ ...formData, tax: { ...formData.tax, rate: Number(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "currency" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Currency Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
                  <input
                    type="text"
                    value={formData.currency?.code || "BDT"}
                    onChange={(e) => setFormData({ ...formData, currency: { ...formData.currency, code: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={formData.currency?.symbol || "৳"}
                    onChange={(e) => setFormData({ ...formData, currency: { ...formData.currency, symbol: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {updateMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
