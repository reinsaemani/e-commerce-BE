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
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import metricsRoutes from "./infrastructure/monitoring/metrics.routes";
import { httpRequestCounter } from "./infrastructure/monitoring/requestCounter";

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

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down",
});



const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later",
});


// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);


app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Reintech API is running 🚀"
  });
});

app.use("/auth/login", loginLimiter);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/metrics", metricsRoutes);



// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);


// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});