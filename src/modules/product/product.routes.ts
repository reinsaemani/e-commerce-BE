import express from "express";
import * as productController from "./product.controller";
import { protectAuth } from "../../middleware/auth-middleware";
import { requireRole } from "../../middleware/role-middleware";
import { Role } from "../../../generated/prisma/client";
import { validateRequest } from "../../middleware/validateRequest-middleware";
import { createProductSchema, updateProductSchema } from "../../types/zod";

const router = express.Router();

router.get("/", productController.getAllProductsController);
router.get("/:id", productController.getByIdProductsController);

// ADMIN ONLY
router.post(
  "/",
  protectAuth,
  requireRole([Role.ADMIN]),
  validateRequest(createProductSchema),
  productController.createProductController
);

router.put(
  "/:id",
  protectAuth,
  requireRole([Role.ADMIN]),
  validateRequest(updateProductSchema),
  productController.updateProductController
);

router.delete(
  "/:id",
  protectAuth,
  requireRole([Role.ADMIN]),
  productController.deleteProductController
);

export default router;