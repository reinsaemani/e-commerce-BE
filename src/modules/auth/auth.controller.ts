import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import { loginSchema } from "../../types/zod";


export const cookieOptions = () => {
  const isProd = process.env.APP_ENV === "production";

  return {
    httpOnly: true,
    secure: true, // Set to true in production when using HTTPS
    sameSite: isProd ? "none" as const : "lax" as const,
    path: "/",
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.json({ ...user, message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);

    res.cookie("jwt", result.user, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ ...result, message: "Logged in successfully" });
  } catch (err: any) {
    res.status(400).json({ message: "Invalid Email or Password" });
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await authService.me(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("jwt", {
    path: "/",
    httpOnly: true,
  });
  res.json({ message: "Logged out successfully" });
};

export const resetPassword = async (req: any, res: Response) => {
  try {
    await authService.resetPassword(req.user.id, req.body.newPassword);
    res.json({ message: "Password updated" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
