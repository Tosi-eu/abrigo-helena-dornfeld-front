import "dotenv/config";
import express from "express";
import cors from "cors";
import medicines from "./routes/medicines";
import cabinets from "./routes/cabinets";
import residents from "./routes/residents";
import inputs from "./routes/inputs";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/medicamentos", medicines);
  app.use("/api/armarios", cabinets);
  app.use("/api/idoso", residents);
  app.use("/api/insumos", inputs);

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "pong from default" });
  });

  return app;
}
