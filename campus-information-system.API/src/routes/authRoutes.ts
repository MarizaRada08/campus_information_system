import { Router } from "express";
import auditTrailMiddleware from "../middleware/auditTrailMiddleware";
import AuthController from "../controllers/authController";

const router = Router();

router.post("/register", AuthController.register);
router.post("/resend-otp", AuthController.resendOTPHandler);
router.post("/verify-otp", AuthController.verifyOTPHandler);
router.post("/login", auditTrailMiddleware, AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);

export default router;
