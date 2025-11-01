import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { casela, nome } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO paciente (num_casela, nome) VALUES ($1, $2) RETURNING *",
      [casela, nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar paciente" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paciente ORDER BY nome");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pacientes" });
  }
});

export default router;
