import { Product } from "../../../generated/prisma/client";

export type TProductID = Product["id"];

export type TProductRead = Pick<
  Product,
  "id" | "name" | "description" | "price" | "stock" | "imageUrl"
>;

export type TProductWrite = Pick<
  Product,
  "name" | "description" | "price" | "stock" | "imageUrl"
>;