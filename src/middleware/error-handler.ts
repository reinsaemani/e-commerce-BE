import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  sendBadRequestResponse,
  sendErrorResponse,
  sendValidationError,
} from "../utils/responseHandler";
import { Prisma } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Zod validation error
  if (error instanceof z.ZodError) {
    const errors = error.issues.map((e: any) => e.message);
    return sendValidationError(response, "Validation Error", errors);
  }

  // Prisma error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      process.env.APP_ENV === "development"
        ? { error: "Prisma Error occurred", details: error }
        : { error: "Error occurred" };

    return sendBadRequestResponse(response, res);
  }

  // JWT error (FIX HERE 🔥)
  if (error instanceof jwt.JsonWebTokenError) {
    const res =
      process.env.APP_ENV === "development"
        ? { error: "JWT Error occurred", message: error.message }
        : { error: "Error occurred" };

    return sendBadRequestResponse(response, res);
  }

  // fallback
  const res =
    process.env.APP_ENV === "development"
      ? { message: error.message }
      : { message: "Internal Server Error" };

  return sendErrorResponse(response, res);
};