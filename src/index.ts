import express from "express";
import "dotenv/config";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import requestLogger from "./middleware/requestLogger";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import orderRoutes from "./modules/order/order.routes";
import productRoutes from "./modules/product/product.routes";
import cookieParser from "cookie-parser";

const app = express();
const port = Number(process.env.PORT) || 3000;

const corsOptions = {
  origin :
    process.env.APP_ENV === 'development'
      ? 'http://localhost:5050' // frontend localhost
      : process.env.ORIGIN, // production
      
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(requestLogger);



// Routes
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Reintech API is running 🚀"
  });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);


// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});