import express from "express";
import {
  sendVerificationCode,
  verifyCode,
  sendResetCode,
  resetPasswordWithCode,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/send-verification-code", sendVerificationCode);
router.post("/auth/verify-code", verifyCode);
router.post("/auth/send-reset-code", sendResetCode);
router.post("/auth/reset-password", resetPasswordWithCode);

export default router;
