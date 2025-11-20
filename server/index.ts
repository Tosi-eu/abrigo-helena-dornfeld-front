import "dotenv/config";
import express from "express";
import cors from "cors";
import medicines from "./routes/medicines";
import cabinets from "./routes/cabinets";
import residents from "./routes/residents";
import inputs from "./routes/inputs";
import login from "./routes/login";
import stock from "./routes/stock";
import movements from "./routes/movements";
import reports from "./routes/report";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/medicamentos", medicines);
  app.use("/api/armarios", cabinets);
  app.use("/api/residentes", residents);
  app.use("/api/insumos", inputs);
  app.use("/api/login", login);
  app.use("/api/estoque", stock);
  app.use("/api/movimentacoes", movements);
  app.use("/api/relatorios", reports);

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "pong from default" });
  });

  return app;
}
