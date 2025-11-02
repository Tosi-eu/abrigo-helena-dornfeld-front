import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const environment = process.env.NODE_ENV || "development";

const connectionString =
  environment === "production"
    ? process.env.PROD_DATABASE_URL
    : process.env.HML_DATABASE_URL;

export const pool = new Pool({
  connectionString
});

pool.on("remove", () =>
  console.log(`🔵 [DB DISCONNECT] Conexão encerrada (${environment.toUpperCase()})`)
);

pool.on("error", (err) => {
  console.error(`❌ [DB ERROR] Erro no pool (${environment.toUpperCase()}):`, err.message);
  console.error(err.stack);
});

const gracefulShutdown = async () => {
  console.log("⚠️ [DB SHUTDOWN] Encerrando pool de conexões...");
  await pool.end();
  console.log("✅ [DB SHUTDOWN] Pool encerrado. Saindo do processo.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);  
process.on("SIGTERM", gracefulShutdown); 