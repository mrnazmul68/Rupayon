import express from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSetting.controller.js";

const router = express.Router();

router.get("/settings", getSiteSettings);
router.put("/settings", updateSiteSettings);

export default router;
