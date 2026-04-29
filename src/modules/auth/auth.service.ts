import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import { User } from "../../../generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

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



// ACCESS TOKEN (short)
const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// REFRESH TOKEN (long)
const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // simpan refresh token ke DB (IMPORTANT)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { password: _, refreshToken: __, ...safeUser } = user;

  return { accessToken, refreshToken, user: safeUser };
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
