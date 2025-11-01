import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO insumo (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar insumo" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM insumo ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar insumos" });
  }
});

export default router;
