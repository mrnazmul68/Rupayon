import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },

    title: {
      type: String,
      trim: true,
      maxLength: 80,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    colors: {
      type: [String],
      default: [],
    },

    size: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    image: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    // ⭐ FEATURE FLAGS (your requirement)
    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isCurated: {
      type: Boolean,
      default: false,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true, versionKey:false }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
