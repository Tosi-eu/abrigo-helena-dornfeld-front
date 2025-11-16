import { Router } from "express";
import { renderToBuffer } from "@react-pdf/renderer";
import { createStockPDF } from "../../client/components/StockReporter";
import { pool } from "../../client/db/connection";

const router = Router();

router.get("/", async (req, res) => {
  const { tipo } = req.query;

  try {
    let rows: any[] = [];

    if (tipo === "medicamentos") {
      const query = `
        SELECT 
          m.nome, m.principio_ativo, SUM(em.quantidade) AS quantidade,
          MIN(em.validade) AS validade, p.nome AS residente
        FROM ESTOQUE_MEDICAMENTO em
        JOIN MEDICAMENTO m ON m.id = em.medicamento_id
        LEFT JOIN PACIENTE p ON p.num_casela = em.casela_id
        GROUP BY m.nome, m.principio_ativo, p.nome
      `;
      const result = await pool.query(query);
      rows = result.rows;
    } else if (tipo === "insumos") {
      const query = `
        SELECT i.nome, SUM(ei.quantidade) AS quantidade, ei.armario_id
        FROM ESTOQUE_INSUMO ei
        JOIN INSUMO i ON i.id = ei.insumo_id
        GROUP BY i.nome, ei.armario_id
      `;
      const result = await pool.query(query);
      rows = result.rows;
    } else if (tipo === "residentes") {
      const query = `
        SELECT 
          p.nome AS residente, m.nome AS medicamento, m.principio_ativo, SUM(em.quantidade) AS quantidade,
          MIN(em.validade) AS validade
        FROM ESTOQUE_MEDICAMENTO em
        JOIN MEDICAMENTO m ON m.id = em.medicamento_id
        JOIN PACIENTE p ON p.num_casela = em.casela_id
        GROUP BY p.nome, m.nome, m.principio_ativo
        ORDER BY p.nome, m.nome
      `;
      const result = await pool.query(query);
      rows = result.rows;
    } else if (tipo === "insumos_medicamentos") {
      const medQuery = `
        SELECT 
          m.nome AS medicamento, m.principio_ativo, SUM(em.quantidade) AS quantidade,
          MIN(em.validade) AS validade, p.nome AS residente
        FROM ESTOQUE_MEDICAMENTO em
        JOIN MEDICAMENTO m ON m.id = em.medicamento_id
        LEFT JOIN PACIENTE p ON p.num_casela = em.casela_id
        GROUP BY m.nome, m.principio_ativo, p.nome
      `;

      const inputQuery = `
        SELECT i.nome AS insumo, SUM(ei.quantidade) AS quantidade, ei.armario_id
        FROM ESTOQUE_INSUMO ei
        JOIN INSUMO i ON i.id = ei.insumo_id
        GROUP BY i.nome, ei.armario_id
      `;

      const [medResult, insumoResult] = await Promise.all([
        pool.query(medQuery),
        pool.query(inputQuery),
      ]);

      rows = [{ medicamentos: medResult.rows, insumos: insumoResult.rows }];
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const pdfBuffer = await renderToBuffer(
      createStockPDF(tipo as string, rows),
    );

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

export default router;
