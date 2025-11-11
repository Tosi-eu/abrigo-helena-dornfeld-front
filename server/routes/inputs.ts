import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO insumo (nome, descricao) VALUES ($1, $2) RETURNING *",
      [nome, descricao],
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const result = await pool.query(
      "UPDATE insumo SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *",
      [nome, descricao, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Insumo não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar insumo" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM insumo WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Insumo não encontrado" });
    }

    res.json({ message: "Insumo deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar insumo" });
  }
});

export default router;
