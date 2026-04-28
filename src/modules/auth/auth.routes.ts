import express from "express";
import * as authController from "./auth.controller";
import { login, register } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { loginSchema, registerSchema, resetPasswordSchema } from "../../types/zod";
import { protectAuth } from "../../middleware/auth-middleware";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", protectAuth, authController.logout);
router.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);
export default router;