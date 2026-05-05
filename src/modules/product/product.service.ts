import { prisma } from "../../utils/prisma";

export const createProductService = async (data: any, userId: string) => {
  return prisma.product.create({
    data: {
      ...data,
      createdById: userId,
    },
  });
};

export const getProductsService = async () => {
  return prisma.product.findMany();
};

export const getProductByIdService = async (id: string) => {
  return prisma.product.findUnique({ where: { id } });
};

// UPDATE
export const updateProductService = async (id: string, data: any) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

// DELETE
export const deleteProductService = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};