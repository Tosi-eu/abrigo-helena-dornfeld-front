import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { nome, dosagem, unidade_medida, principio_ativo, estoque_minimo } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO medicamento (nome, dosagem, unidade_medida, principio_ativo, estoque_minimo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, dosagem, unidade_medida, principio_ativo, estoque_minimo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar medicamento" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM medicamento ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar medicamentos" });
  }
});

export default router;
