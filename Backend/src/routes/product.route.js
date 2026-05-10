import express from "express";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// READ ALL
router.get("/products", getProducts);

// READ ONE
router.get("/products/:id", getSingleProduct);

// CREATE
router.post("/products", createProduct);

// UPDATE
router.put("/products/:id", updateProduct);

// DELETE
router.delete("/products/:id", deleteProduct);

export default router;
