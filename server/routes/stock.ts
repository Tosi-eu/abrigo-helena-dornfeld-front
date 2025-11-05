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
  const {
    medicamento_id,
    insumo_id,
    quantidade,
    armario_id,
    casela_id,
    validade,
    origem,
    tipo,
    tipo_entrada,
  } = req.body;

  try {
    const validQuantidade = Number(quantidade);
    const validArmarioId = Number(armario_id);
    const validCaselaId = casela_id ? Number(casela_id) : null;
    const validMedicamentoId = medicamento_id ? Number(medicamento_id) : null;
    const validInsumoId = insumo_id ? Number(insumo_id) : null;
    const validadeFormatada = validade
      ? new Date(validade).toISOString().split("T")[0]
      : null;

    if (!tipo_entrada || isNaN(validQuantidade) || isNaN(validArmarioId)) {
      return res.status(400).json({
        error: "Campos obrigatórios inválidos ou ausentes.",
      });
    }

    if (tipo_entrada === "medicamento") {
      if (!validMedicamentoId) {
        return res.status(400).json({ error: "medicamento_id é obrigatório." });
      }

      await pool.query(
        `
        INSERT INTO ESTOQUE_MEDICAMENTO (
          medicamento_id, casela_id, armario_id, validade, quantidade, origem, tipo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          validMedicamentoId,
          validCaselaId,
          validArmarioId,
          validadeFormatada,
          validQuantidade,
          origem,
          tipo,
        ],
      );
    } else if (tipo_entrada === "insumo") {
      await pool.query(
        `
        INSERT INTO ESTOQUE_INSUMO (
          insumo_id, armario_id, quantidade
        )
        VALUES ($1, $2, $3);
        `,
        [validInsumoId, validArmarioId, validQuantidade],
      );
    } else {
      return res.status(400).json({ error: "tipo_entrada inválido." });
    }

    return res.json({ message: "Entrada registrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar entrada:", err);
    return res.status(500).json({ error: "Erro ao registrar entrada." });
  }
});

router.post("/saida", async (req, res) => {
  const { tipo, itemId, quantidade, armarioId } = req.body;

  console.log(tipo, itemId, quantidade, armarioId);
  try {
    if (tipo === "medicamento") {
      await pool.query(
        `UPDATE ESTOQUE_MEDICAMENTO
         SET quantidade = quantidade - $1
         WHERE medicamento_id = $2 AND armario_id = $3;`,
        [quantidade, itemId, armarioId],
      );
    } else if (tipo === "insumo") {
      await pool.query(
        `UPDATE ESTOQUE_INSUMO
         SET quantidade = quantidade - $1
         WHERE insumo_id = $2 AND armario_id = $3;`,
        [quantidade, itemId, armarioId],
      );
    }

    res.json({ message: "Saída registrada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar saída" });
  }
});

export default router;
