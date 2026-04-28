import { prisma } from "../../utils/prisma";

export const getAllUsersService = async (role: string) => {
  if (role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getUserByIdService = async (id: string, role: string) => {
  if (role !== "ADMIN" && id !== id) {
    throw new Error("Forbidden");
  }

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const updateUserService = async (
  id: string,
  data: { name?: string; email?: string },
  role: string,
) => {
  if (role !== "ADMIN" && id !== id) {
    throw new Error("Forbidden");
  }

  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUserService = async (id: string, role: string) => {
  if (role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return prisma.user.delete({ where: { id } });
};