import { Order, OrderItem } from "../../../generated/prisma/client";

export type TOrderID = Order["id"];

export type TOrderRead = Order & {
  items: OrderItem[];
};

export type TOrderWrite = {
  items: {
    productId: string;
    quantity: number;
  }[];
};