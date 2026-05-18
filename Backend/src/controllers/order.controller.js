import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const orderNumber = "ORD-" + Date.now();
    const order = new Order({
      ...req.body,
      orderNumber,
      hasNewActivity: true,
      activityMessage: "New order placed",
    });
    const savedOrder = await order.save();

    if (req.body.userId || req.body.customerEmail) {
      const profileUpdates = {
        name: req.body.customerName,
        phone: req.body.customerPhone,
        hasNewActivity: true,
        activityMessage: "User placed an order",
        activitySeenAt: null,
        address: {
          street: req.body.shippingAddress?.address || "",
          city: req.body.shippingAddress?.city || "",
          state: req.body.shippingAddress?.state || "",
          postalCode: req.body.shippingAddress?.postalCode || "",
          country: req.body.shippingAddress?.country || "",
        },
      };

      const profileFilters = [];

      if (req.body.userId) {
        profileFilters.push({ uid: req.body.userId });
        if (req.body.userId.match(/^[0-9a-fA-F]{24}$/)) {
          profileFilters.push({ _id: req.body.userId });
        }
      }

      if (req.body.customerEmail) {
        profileFilters.push({ email: req.body.customerEmail.trim().toLowerCase() });
      }

      await User.findOneAndUpdate(
        { $or: profileFilters },
        profileUpdates,
        { new: true, runValidators: true }
      ).catch(() => null);
    }

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderBeforeUpdate = await Order.findById(req.params.id);

    if (!orderBeforeUpdate) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    const isCompleted = order.status === "delivered" && !orderBeforeUpdate.stockDecreased;

    if (isCompleted) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }
      order.stockDecreased = true;
      await order.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBulkOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No order IDs provided" });
    }

    const result = await Order.deleteMany({ _id: { $in: ids } });

    res.json({ success: true, message: `${result.deletedCount} orders deleted successfully`, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markOrdersActivitySeen = async (req, res) => {
  try {
    await Order.updateMany(
      { hasNewActivity: true },
      {
        hasNewActivity: false,
        activitySeenAt: new Date(),
      }
    );

    res.json({ success: true, message: "Order activity marked as seen" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({ status: "processing" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
