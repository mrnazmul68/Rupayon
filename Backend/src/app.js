import express from "express";
export const app = express();
import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import orderRoutes from "./routes/order.route.js";
import userRoutes from "./routes/user.route.js";
import siteSettingRoutes from "./routes/siteSetting.route.js";
import uploadRoutes from "./routes/upload.route.js";
import reviewRoutes from "./routes/review.route.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/v1", productRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", siteSettingRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", reviewRoutes);

const frontendDistPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith("/api")) {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  } else {
    next();
  }
});
