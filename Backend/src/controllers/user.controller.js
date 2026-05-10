import User from "../models/user.model.js";

export const syncUser = async (req, res) => {
  try {
    const { uid, email, name, avatar, phone } = req.body;
    
    let user = await User.findOne({ uid });
    
    if (!user) {
      user = new User({
        uid,
        email,
        name: name || email.split("@")[0],
        avatar,
        phone,
        role: email === process.env.ADMIN_EMAIL ? "admin" : "customer",
      });
    } else {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.phone = phone || user.phone;
      if (email === process.env.ADMIN_EMAIL) {
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
    const user = await User.findOne({ $or: [{ _id: req.params.id }, { uid: req.params.id }] });

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
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
