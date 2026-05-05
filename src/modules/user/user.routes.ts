import express from "express";
import * as userController from "./user.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { getAllUsersController } from "./user.controller";
import { Role } from "../../../generated/prisma/browser";
import { requireRole } from "../../middleware/role-middleware";

const router = express.Router();

// current user
router.get("/me", protectAuth, userController.getMeController);

// admin / general user listing
router.get("/", protectAuth, requireRole([Role.ADMIN]), getAllUsersController);
// by id
router.get("/:id", protectAuth, requireRole([Role.ADMIN]), userController.getUserByIdController);

// update own profile
router.put("/me", protectAuth, userController.updateUserController);

// delete user (admin only)
router.delete("/:id", protectAuth, requireRole([Role.ADMIN]), userController.deleteUserController);

export default router;