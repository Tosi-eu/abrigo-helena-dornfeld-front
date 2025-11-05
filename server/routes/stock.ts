import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [medRows, insRows] = await Promise.all([
      pool.query(`
        SELECT 
          em.id,
          m.nome AS nome_medicamento,
          m.principio_ativo,
          em.validade,
          em.quantidade,
          em.origem,
          em.tipo,
          em.armario_id,
          em.casela_id
        FROM ESTOQUE_MEDICAMENTO em
        JOIN MEDICAMENTO m ON m.id = em.medicamento_id;
      `),
      pool.query(`
        SELECT 
          ei.id,
          i.nome AS nome_insumo,
          i.descricao,
          ei.quantidade,
          ei.armario_id
        FROM ESTOQUE_INSUMO ei
        JOIN INSUMO i ON i.id = ei.insumo_id;
      `),
    ]);

    res.json({
      medicamentos: medRows.rows,
      insumos: insRows.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
});

router.post("/entrada", async (req, res) => {
  const { tipo, itemId, quantidade, armarioId, caselaId, validade, stockType } = req.body;

  const validItemId = parseInt(itemId, 10);
  const validQuantidade = parseInt(quantidade, 10);
  const validArmarioId = parseInt(armarioId, 10);
  const validCaselaId = caselaId ? parseInt(caselaId, 10) : null;

  if (isNaN(validItemId) || isNaN(validQuantidade) || isNaN(validArmarioId)) {
    return res.status(400).json({ error: "Valores inválidos para itemId, quantidade ou armarioId." });
  }

  try {
    if (tipo === "medicamento") {
      await pool.query(
        `INSERT INTO ESTOQUE_MEDICAMENTO (medicamento_id, casela_id, armario_id, validade, quantidade, tipo)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING;`,
        [validItemId, validCaselaId, validArmarioId, validade, validQuantidade, stockType]
      );
    } else if (tipo === "insumo") {
      await pool.query(
        `INSERT INTO ESTOQUE_INSUMO (insumo_id, armario_id, quantidade)
         VALUES ($1, $2, $3)
         ON CONFLICT (insumo_id, armario_id)
         DO UPDATE SET quantidade = ESTOQUE_INSUMO.quantidade + EXCLUDED.quantidade;`,
        [validItemId, validArmarioId, validQuantidade]
      );
    }

    res.json({ message: "Entrada registrada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar entrada" });
  }
});

router.post("/saida", async (req, res) => {
  const { tipo, itemId, quantidade, armarioId, caselaId } = req.body;

  try {
    if (tipo === "medicamento") {
      await pool.query(
        `UPDATE ESTOQUE_MEDICAMENTO
         SET quantidade = GREATEST(quantidade - $1, 0)
         WHERE medicamento_id = $2 AND armario_id = $3;`,
        [quantidade, itemId, armarioId]
      );
    } else if (tipo === "insumo") {
      await pool.query(
        `UPDATE ESTOQUE_INSUMO
         SET quantidade = GREATEST(quantidade - $1, 0)
         WHERE insumo_id = $2 AND armario_id = $3;`,
        [quantidade, itemId, armarioId]
      );
    }

    res.json({ message: "Saída registrada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar saída" });
  }
});

export default router;