import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as authController from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/verify-email", authController.verifyEmail);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/verify-email", authController.verifyEmail);
router.post("/google", authController.googleLogin);

// Example protected route
router.get(
  "/me",
  authMiddleware(["ADMIN", "DOCTOR", "PATIENT"]),
  (req, res) => {
    res.json({ user: (req as any).user });
  }
);

export default router;