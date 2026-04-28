import { Request, Response } from "express";
import * as productService from "./product.service";
import {
  createProductSchema,
  updateProductSchema,
} from "../../types/zod";

// CREATE PRODUCT (🔥 ZOD)
export const createProductController = async (req: any, res: Response) => {
  const parsed = createProductSchema.parse(req.body);

  const product = await productService.createProductService(
    parsed,
    req.user.id
  );

  res.json({ ...product, message: "Product created successfully" });
};

// GET ALL
export const getAllProductsController = async (_: Request, res: Response) => {
  const products = await productService.getProductsService();
  res.json(products);
};

// GET BY ID
export const getByIdProductsController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await productService.getProductByIdService(id);

  res.json(product);
};

// UPDATE (🔥 ZOD)
export const updateProductController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const parsed = updateProductSchema.parse(req.body);

  const product = await productService.updateProductService(id, parsed);

  res.json({ ...product, message: "Updated Product successfully" });
};

// DELETE
export const deleteProductController = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  await productService.deleteProductService(id);

  res.json({ message: "Product deleted" });
};