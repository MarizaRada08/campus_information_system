import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { Otp } from "../models/otpModel";
import { JWT_SECRET } from "../config/config";
import { validateUser } from "../validations/userValidation";
import { generateOTP, sendOTP } from "../services/otpService";

class AuthController {
  // User Login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid password" });
        return;
      }

      if (!user.isVerified) {
        res.status(400).json({ message: "User is not verified. Please verify your email first." });
        return;
      }

      const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });
      const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });

      res.locals.userId = user._id;

      res.json({
        message: "Login successful.",
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login", error });
    }
  }

  // User Logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.json({ message: "Logout successful." });
    } catch (error) {
      res.status(500).json({ message: "Error during logout", error });
    }
  }

  // User Registration
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateUser(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }

      const { email, password } = payload;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ email, password: hashedPassword, isVerified: false });
      await user.save();

      const otp = generateOTP();
      await Otp.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true, new: true });

      const result = await sendOTP(email, otp);
      if (!result.success) {
        res.status(500).json({ message: "Error sending OTP" });
        return;
      }

      res.status(201).json({
        message: "User registered successfully. Please verify your email with the OTP sent to your inbox.",
        user: { email },
      });
    } catch (error) {
      res.status(500).json({ message: "Error during registration", error });
    }
  }

  // OTP Verification and Token Generation
  async verifyOTPHandler(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    try {
      const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      await Otp.deleteOne({ email });

      const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });
      const refreshToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "24h" });

      res.json({
        message: "OTP verified successfully. Login successful.",
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user verification status", error });
    }
  }

  // Resend OTP
  async resendOTPHandler(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User is already verified" });
      return;
    }

    const otp = generateOTP();
    await Otp.findOneAndUpdate({ email }, { otp, createdAt: new Date() }, { upsert: true, new: true });

    const result = await sendOTP(email, otp);
    if (!result.success) {
      res.status(500).json({ message: "Error sending OTP" });
      return;
    }

    res.json({ message: "OTP resent successfully" });
  }

  // Refresh Access Token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
      }

      jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
        if (err) {
          res.status(403).json({ message: "Invalid or expired refresh token" });
          return;
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "10m" });

        res.json({ accessToken });
      });
    } catch (error) {
      res.status(500).json({ message: "Error refreshing token", error });
    }
  }
}

export default new AuthController();
