import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Rupayon",
    },
    siteDescription: String,
    siteLogo: String,
    siteFavicon: String,
    
    heroSection: {
      title: { type: String, default: "Discover Your Style" },
      subtitle: { type: String, default: "Explore our exclusive collection of premium products" },
      buttonText: { type: String, default: "Shop Now" },
      buttonLink: { type: String, default: "/shop" },
      backgroundImage: String,
      heroImage: String,
    },

    featuredSection: {
      title: { type: String, default: "Featured Products" },
      subtitle: { type: String, default: "Handpicked selections just for you" },
      enabled: { type: Boolean, default: true },
    },

    bestSellerSection: {
      title: { type: String, default: "Best Sellers" },
      subtitle: { type: String, default: "Our most popular products" },
      enabled: { type: Boolean, default: true },
    },

    newArrivalSection: {
      title: { type: String, default: "New Arrivals" },
      subtitle: { type: String, default: "Latest additions to our collection" },
      enabled: { type: Boolean, default: true },
    },

    aboutSection: {
      title: { type: String, default: "About Us" },
      description: { type: String, default: "We provide the best quality products for our customers" },
      image: String,
      enabled: { type: Boolean, default: true },
    },

    contactEmail: {
      type: String,
      default: "support@rupayon.com",
    },
    contactPhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
    },
    shipping: {
      freeShippingThreshold: {
        type: Number,
        default: 0,
      },
      standardShippingRate: {
        type: Number,
        default: 0,
      },
    },
    tax: {
      rate: {
        type: Number,
        default: 0,
      },
    },
    currency: {
      code: {
        type: String,
        default: "BDT",
      },
      symbol: {
        type: String,
        default: "৳",
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const SiteSetting = mongoose.model("SiteSetting", siteSettingSchema);

export default SiteSetting;
