import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../utils/prisma";

export const createOrderService = async (userId: string, items: any[]) => {
  let total = 0;

  const orderItems = await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error("Product not found");

      total += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  return prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: orderItems,
      },
    },
    include: { items: true },
  });
};

// READ ALL ORDER (user)
export const getOrdersByUserService = async (userId: string, role: string) => {
  if (role === "ADMIN") {
    return prisma.order.findMany({ include: { items: true } });
  }

  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });
};

// READ BY ID
export const getOrderByIdService = async (id: string, userId: string, role: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found");

  if (role !== "ADMIN" && order.userId !== userId) {
    throw new Error("Forbidden");
  }

  return order;
};

// UPDATE STATUS (admin)
export const updateOrderStatusService = async (id: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
};

// DELETE ORDER
export const deleteOrderService = async (id: string) => {
  return prisma.order.delete({
    where: { id },
  });
};