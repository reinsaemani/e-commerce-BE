import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHandler";
import { getUserByIdService } from "../modules/user/user.service";

type DecodedToken = {
  id: string;
  role: string;
};

const protectAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - you need to login" });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;

    const authUser = await getUserByIdService(decoded.id,decoded.role);

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = {
      id: authUser.id,
      name: authUser.name,
      role: authUser.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

export { protectAuth };