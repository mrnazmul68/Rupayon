import User from "../models/user.model.js";
import { getFirebaseAuth } from "../config/firebaseAdmin.js";
import mongoose from "mongoose";

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const buildUserIdentityFilter = (id) => {
  const filters = [{ uid: id }];

  if (mongoose.Types.ObjectId.isValid(id)) {
    filters.unshift({ _id: id });
  }

  return { $or: filters };
};

export const syncUser = async (req, res) => {
  try {
    const { uid, name, avatar, phone } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!uid || !email) {
      return res.status(400).json({ success: false, message: "User id and email are required" });
    }

    let user = await User.findOne({ uid });
    
    if (!user) {
      user = new User({
        uid,
        email,
        name: name || email.split("@")[0],
        avatar,
        phone,
        role: email === normalizeEmail(process.env.ADMIN_EMAIL) ? "admin" : "customer",
        hasNewActivity: true,
        activityMessage: "New user registered",
      });
    } else {
      user.email = email || user.email;
      user.name = user.name || name || email.split("@")[0];
      user.avatar = user.avatar || avatar;
      user.phone = user.phone || phone;
      if (email === normalizeEmail(process.env.ADMIN_EMAIL)) {
        user.role = "admin";
      }
    }
    
    const savedUser = await user.save();
    res.json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne(buildUserIdentityFilter(req.params.id));

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      hasNewActivity: req.body.hasNewActivity ?? true,
      activityMessage: req.body.activityMessage || "New user created",
    });
    const savedUser = await user.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { markActivity, activityMessage, ...updates } = req.body;

    if (markActivity) {
      updates.hasNewActivity = true;
      updates.activityMessage = activityMessage || "User updated profile";
      updates.activitySeenAt = null;
    }

    const user = await User.findOneAndUpdate(
      buildUserIdentityFilter(req.params.id),
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("Attempting to delete user with ID:", req.params.id);
    
    const user = await User.findOne(buildUserIdentityFilter(req.params.id));

    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Found user:", user.email, "UID:", user.uid);

    if (user.uid) {
      try {
        console.log("Deleting user from Firebase...");
        await getFirebaseAuth().deleteUser(user.uid);
        console.log("User deleted from Firebase successfully");
      } catch (firebaseError) {
        if (firebaseError.code !== "auth/user-not-found") {
          console.error("Firebase deletion error:", firebaseError);
          throw firebaseError;
        }
        console.log("User not found in Firebase, skipping Firebase deletion");
      }
    } else {
      console.log("User has no Firebase UID, skipping Firebase deletion");
    }

    console.log("Deleting user from MongoDB...");
    await user.deleteOne();
    console.log("User deleted from MongoDB successfully");

    res.json({ success: true, message: "User deleted from Firebase and database successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markUsersActivitySeen = async (req, res) => {
  try {
    await User.updateMany(
      { hasNewActivity: true },
      {
        hasNewActivity: false,
        activitySeenAt: new Date(),
      }
    );

    res.json({ success: true, message: "User activity marked as seen" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
