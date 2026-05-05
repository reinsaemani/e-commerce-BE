import { Request, Response } from "express";
import * as userService from "./user.service";
import { updateUserSchema } from "../../types/zod";

// GET ALL USERS (ADMIN ONLY biasanya, tapi ini tetap aman)
export const getAllUsersController = async (req: any, res: Response) => {
  const users = await userService.getAllUsersService(req.user.role);
  res.json(users);
};

// GET ME
export const getMeController = async (req: any, res: Response) => {
  const user = await userService.getUserByIdService(req.user.id, req.user.role);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// GET BY ID
export const getUserByIdController = async (req: any, res: Response) => {
  const id = String(req.params.id);
  const user = await userService.getUserByIdService(id, req.user.role);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// UPDATE USER (🔥 ZOD DI SINI)
export const updateUserController = async (req: any, res: Response) => {
  const parsed = updateUserSchema.parse(req.body);

  const user = await userService.updateUserService(
    req.user.id,
    parsed,
    req.user.role
  );

  res.json({ ...user, message: "Updated User successfully" });
};

// DELETE USER
export const deleteUserController = async (req: any, res: Response) => {
  const id = String(req.params.id);
  await userService.deleteUserService(id, req.user.role);

  res.json({ message: "User deleted successfully" });
};