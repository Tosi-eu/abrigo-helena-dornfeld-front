import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { casela, nome } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO paciente (num_casela, nome) VALUES ($1, $2) RETURNING *",
      [casela, nome],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao cadastrar paciente:", err);
    res
      .status(500)
      .json({ error: `Erro ao cadastrar paciente: ${err.message ?? err}` });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paciente ORDER BY nome");
    res.json(result.rows);
  } catch (err: any) {
    console.error("Erro ao buscar pacientes:", err);
    res
      .status(500)
      .json({ error: `Erro ao buscar pacientes: ${err.message ?? err}` });
  }
});

router.put("/:casela", async (req, res) => {
  const { casela } = req.params;
  const { nome } = req.body;

  try {
    const result = await pool.query(
      "UPDATE paciente SET nome = $1 WHERE num_casela = $2 RETURNING *",
      [nome, casela],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err: any) {
    console.error("Erro ao editar paciente:", err);
    res
      .status(500)
      .json({ error: `Erro ao editar paciente: ${err.message ?? err}` });
  }
});

router.delete("/:casela", async (req, res) => {
  const { casela } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM paciente WHERE num_casela = $1 RETURNING *",
      [casela],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    res
      .status(200)
      .json({ message: `Paciente ${casela} excluído com sucesso.` });
  } catch (err: any) {
    console.error("Erro ao excluir paciente:", err);
    res
      .status(500)
      .json({ error: `Erro ao excluir paciente: ${err.message ?? err}` });
  }
});

export default router;