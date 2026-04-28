import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwtHandler";
import { getUserByIdService } from "../modules/user/user.service";

type DecodedToken = {
  id: string;
  role: string;
};

const protectAuth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = request.cookies?.jwt;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Unauthorized - you need to login" });
  }

  try {
    const decoded = verifyToken(token) as DecodedToken;

    const authUser = await getUserByIdService(decoded.id, "ADMIN");

    if (!authUser) {
      return response
        .status(401)
        .json({ message: "Unauthorized - user not found" });
    }

    request.user = {
      id: authUser.id,
      name: authUser.name,
      role: authUser.role,
    };

    return next();
  } catch (error) {
    return response
      .status(401)
      .json({ message: "Unauthorized - invalid token" });
  }
};

export { protectAuth };