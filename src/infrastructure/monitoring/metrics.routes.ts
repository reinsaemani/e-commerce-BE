import express from "express";
import { register } from "./metrics";

const router = express.Router();

router.get("/", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;