import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_DATABASE_URL
    : process.env.HML_DATABASE_URL;

export const pool = new Pool({
  connectionString,
});

pool.on("connect", () => {
  console.log(`✅ Conectado ao banco ${process.env.NODE_ENV}`);
});
