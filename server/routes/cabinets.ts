import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { numero, categoria } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO armario (num_armario, categoria) VALUES ($1, $2)",
      [numero, categoria],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Erro ao cadastrar armário ${err}` });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM armario ORDER BY num_armario",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar armários" });
  }
});

router.put("/:numero", async (req, res) => {
  const { numero } = req.params;
  const { categoria } = req.body;

  try {
    const result = await pool.query(
      "UPDATE armario SET categoria = $1 WHERE num_armario  = $2 RETURNING *",
      [categoria, numero],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Armário não encontrado" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao editar armário:", err);
    return res
      .status(500)
      .json({ error: `Erro ao editar armário: ${err.message ?? err}` });
  }
});

router.delete("/:numero", async (req, res) => {
  const { numero } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM armario WHERE num_armario = $1 RETURNING *",
      [numero],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Armário não encontrado" });
    }

    return res
      .status(200)
      .json({ message: `Armário ${numero} excluído com sucesso.` });
  } catch (err: any) {
    console.error("Erro ao excluir armário:", err);
    return res
      .status(500)
      .json({ error: `Erro ao excluir armário: ${err.message ?? err}` });
  }
});

export default router;
