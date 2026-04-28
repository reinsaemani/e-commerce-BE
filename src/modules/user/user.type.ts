import { User, Role } from "../../../generated/prisma/client";

// ID type
export type TUserId = User["id"];

// Read (public safe response)
export type TUserRead = Pick<
  User,
  "id" | "name" | "email" | "role" | "createdAt"
>;

// Update payload (user update sendiri)
export type TUserUpdate = {
  name?: string;
  email?: string;
};

// Admin update role
export type TUserUpdateRole = {
  role: Role;
};