import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";


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
    const { password, ...safeUser } = user;
    res.json({ ...safeUser, message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).json({
  success: false,
  error: {
    message: err.message || "Something went wrong",
    code: "BAD_REQUEST"
  }
});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);

    // ACCESS TOKEN (boleh di response)
    res.cookie("accessToken", result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    // REFRESH TOKEN (WAJIB HTTP ONLY)
    res.cookie("refreshToken", result.refreshToken, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.json({
      user: result.user,
      message: "Logged in successfully",
    });
  } catch (err: any) {
    res.status(400).json({
  success: false,
  error: {
    message: err.message || "Something went wrong",
    code: "BAD_REQUEST"
  }
});
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = await authService.me(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({
  success: false,
  error: {
    message: err.message || "Something went wrong",
    code: "BAD_REQUEST"
  }
});
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as any;


      if (decoded?.id) {
        await prisma.user.update({
          where: { id: decoded.id },
          data: { refreshToken: null },
        });
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
};

export const resetPassword = async (req: any, res: Response) => {
  try {
    await authService.resetPassword(req.user.id, req.body.newPassword);
    res.json({ message: "Password updated" });
  } catch (err: any) {
    res.status(400).json({
  success: false,
  error: {
    message: err.message || "Something went wrong",
    code: "BAD_REQUEST"
  }
});
  }
};


export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT env missing");
    }

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!refreshSecret) throw new Error("Missing JWT_REFRESH_SECRET");

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};