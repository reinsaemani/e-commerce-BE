import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { User } from "../../../generated/prisma/client";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const hashed = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });
};

export const getAuthByEmail = async (
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET!,
  expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as "1d" | "7d" | "30d",
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    {  expiresIn: JWT_CONFIG.expiresIn, }
  );

  // remove sensitive data
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};

export const me = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const resetPassword = async (userId: string, newPassword: string) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};