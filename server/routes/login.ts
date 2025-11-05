import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO login (login, password) VALUES ($1, $2) RETURNING id, login",
      [login, password],
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.message.includes("duplicate key")) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ error: `Erro ao cadastrar usuário` });
  }
});

router.get("/", async (req, res) => {
  const { login, password } = req.query;

  if (!login || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT id, login FROM login WHERE login = $1 AND password = $2",
      [login, password],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

export default router;
