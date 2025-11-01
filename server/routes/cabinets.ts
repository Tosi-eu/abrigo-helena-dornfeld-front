import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { numero, categoria } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO armario (num_armario, categoria) VALUES ($1, $2) RETURNING *",
      [numero, categoria]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erro ao cadastrar armário ${err}` });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM armario ORDER BY num_armario");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar armários" });
  }
});

export default router;
