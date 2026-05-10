import express from "express";
import {
  getOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getDashboardStats,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/orders/:id", getSingleOrder);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);
router.get("/dashboard/stats", getDashboardStats);

export default router;
