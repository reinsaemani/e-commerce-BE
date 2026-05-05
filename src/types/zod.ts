import {z} from "zod";
import { Role } from "../../generated/prisma/browser";

// _____________  Auth Schema  _____________

// REGISTER
export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// LOGIN
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Reset Password
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6).max(50),
});

// Update Role
export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>;

// ------------------Product------------------

// CREATE PRODUCT
export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().int().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
});

// UPDATE PRODUCT
export const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional(),
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>;

// ------------------Order------------------

// CREATE ORDER
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().cuid(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Order must have at least 1 item"),
});

// UPDATE STATUS (kalau nanti admin update)
export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});

export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;
export type TUpdateOrderStatusSchema = z.infer<typeof updateOrderStatusSchema>;



// ------------------User------------------
export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;