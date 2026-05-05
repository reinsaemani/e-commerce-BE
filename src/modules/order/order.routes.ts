import express from "express";
import * as orderController from "./order.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { Role } from "../../../generated/prisma/client";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../../types/zod";

const router = express.Router();

// USER
router.post("/", protectAuth, validateRequest(createOrderSchema), orderController.createOrderController);

// USER + ADMIN (filtered inside service)
router.get("/", protectAuth, orderController.getAllOrdersController);

router.get("/:id", protectAuth, orderController.getByIdOrderController);

// ADMIN ONLY
router.put("/:id/status", protectAuth, requireRole([Role.ADMIN]), validateRequest(updateOrderStatusSchema), orderController.updateOrderStatusController);

router.delete(
  "/:id",
  protectAuth,
  requireRole([Role.ADMIN]),
  orderController.deleteOrderController
);

export default router;