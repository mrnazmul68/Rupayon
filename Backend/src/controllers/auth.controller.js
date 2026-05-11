import User from "../models/user.model.js";
import { sendVerificationEmail, sendPasswordResetEmail, generateCode } from "../services/emailService.js";

export const sendVerificationCode = async (req, res) => {
  try {
    const { email, name } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    await user.save();

    await sendVerificationEmail({ email, name: user.name || name, code });

    res.json({ success: true, message: "Verification code sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ success: false, message: "Verification code expired" });
    }

    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await user.save();

    await sendPasswordResetEmail({ email, name: user.name, code });

    res.json({ success: true, message: "Password reset code sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid reset code" });
    }

    if (new Date() > user.resetCodeExpires) {
      return res.status(400).json({ success: false, message: "Reset code expired" });
    }

    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
