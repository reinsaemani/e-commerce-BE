import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { OrderStatus, Role } from "../generated/prisma/enums";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // =====================
  // 1. USERS
  // =====================
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      name: "User Test",
      email: "user@test.com",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  console.log("👤 Users created");

  // =====================
  // 2. PRODUCTS
  // =====================
  const product1 = await prisma.product.create({
    data: {
      name: "Keyboard Mechanical",
      description: "RGB mechanical keyboard",
      price: 500000,
      stock: 10,
      imageUrl: "https://example.com/keyboard.jpg",
      createdById: admin.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Mouse Gaming",
      description: "High precision gaming mouse",
      price: 250000,
      stock: 20,
      imageUrl: "https://example.com/mouse.jpg",
      createdById: admin.id,
    },
  });

  console.log("📦 Products created");

  // =====================
  // 3. ORDER SAMPLE
  // =====================
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: OrderStatus.PENDING,
      total: product1.price + product2.price,
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: product1.price,
          },
          {
            productId: product2.id,
            quantity: 1,
            price: product2.price,
          },
        ],
      },
    },
    include: { items: true },
  });

  console.log("🧾 Order created");

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });