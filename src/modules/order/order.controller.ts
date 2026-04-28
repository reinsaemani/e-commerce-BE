import { Request, Response } from "express";
import * as orderService from "./order.service";


export const assertUser = (req: any) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }
  return req.user;
};

export const createOrderController = async (req: any, res: Response) => {
  try {
    
    const order = await orderService.createOrderService(
      req.user.id,
      req.body.items
    );

    res.json({ ...order, message: "Order created successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllOrdersController = async (req: any, res: Response) => {
  const orders = await orderService.getOrdersByUserService(req.user.id, req.user.role);
  res.json(orders);
};

export const getByIdOrderController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = assertUser(req);

  const order = await orderService.getOrderByIdService(
    id,
    user.id,
    user.role
  );

  res.json(order);
};

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = assertUser(req);

  const order = await orderService.updateOrderStatusService(
    id,
    req.body.status
  );

  res.json({ ...order, message: "Order status updated successfully" });
};

export const deleteOrderController = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const user = assertUser(req);
  await orderService.deleteOrderService(id);
  res.json({ message: "Order deleted successfully" });
};