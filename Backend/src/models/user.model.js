import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: String,
    avatar: String,
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    hasNewActivity: {
      type: Boolean,
      default: false,
    },
    activityMessage: String,
    activitySeenAt: Date,
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);

export default User;
