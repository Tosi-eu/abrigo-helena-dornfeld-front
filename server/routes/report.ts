import { Router } from "express";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { createStockPDF } from "../../client/components/StockReporter"; 
import { pool } from "../../client/db/connection";

const router = Router();

router.get("/", async (req, res) => {
  const { tipo } = req.query;

  try {
    let query = "";

    if (tipo === "medicamentos") {
      query = `
        SELECT 
          m.nome, m.principio_ativo, SUM(em.quantidade) AS quantidade,
          MIN(em.validade) AS validade, p.nome AS residente
        FROM ESTOQUE_MEDICAMENTO em
        JOIN MEDICAMENTO m ON m.id = em.medicamento_id
        LEFT JOIN PACIENTE p ON p.num_casela = em.casela_id
        GROUP BY m.nome, m.principio_ativo, p.nome
      `;
    } else if (tipo === "insumos") {
      query = `
        SELECT i.nome, SUM(ei.quantidade) AS quantidade, ei.armario_id
        FROM ESTOQUE_INSUMO ei
        JOIN INSUMO i ON i.id = ei.insumo_id
        GROUP BY i.nome, ei.armario_id
      `;
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const { rows } = await pool.query(query);
    const pdfBuffer = await renderToBuffer(createStockPDF(tipo as string, rows));

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

export default router;