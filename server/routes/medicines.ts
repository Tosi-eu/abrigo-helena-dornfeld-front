import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { nome, dosagem, unidade_medida, principio_ativo, estoque_minimo } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO medicamento (nome, dosagem, unidade_medida, principio_ativo, estoque_minimo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, dosagem, unidade_medida, principio_ativo, estoque_minimo],
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, dosagem, unidade_medida, principio_ativo, estoque_minimo } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE medicamento
       SET nome = $1, dosagem = $2, unidade_medida = $3, principio_ativo = $4, estoque_minimo = $5
       WHERE id = $6 RETURNING *`,
      [nome, dosagem, unidade_medida, principio_ativo, estoque_minimo, id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Medicamento não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar medicamento" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM medicamento WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Medicamento não encontrado" });

    res.json({ message: "Medicamento removido com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover medicamento" });
  }
});

export default router;
