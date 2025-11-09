  import { Router } from "express";
  import { pool } from "../../client/db/connection";

  const router = Router();

  router.get("/medicamentos", async (req, res) => {
    try {
      const days = Number(req.query.days) || 0;
      const type = req.query.type as string | undefined;

      const params: any[] = [];
      let whereClause = "WHERE mv.medicamento_id IS NOT NULL";

      if (days > 0) {
        whereClause += ` AND mv.data >= NOW() - INTERVAL '${days} DAYS'`;
      }

      if (type && (type === "entrada" || type === "saida")) {
        params.push(type);
        whereClause += ` AND mv.tipo = $${params.length}`;
      }

      const query = `
        SELECT
          mv.id,
          m.nome AS name,
          m.principio_ativo AS "additionalData",
          mv.quantidade AS quantity,
          l.login AS operator,
          mv.data AS "movementDate",
          a.num_armario AS cabinet,
          p.nome AS patient,
          mv.tipo AS type,
          mv.data as date,
          mv.casela_id as casela
        FROM MOVIMENTACAO mv
        JOIN login l ON l.id = mv.login_id
        JOIN medicamento m ON m.id = mv.medicamento_id
        JOIN armario a ON a.num_armario = mv.armario_id
        LEFT JOIN paciente p ON p.num_casela = mv.casela_id
        LEFT JOIN ESTOQUE_MEDICAMENTO em 
          ON em.medicamento_id = mv.medicamento_id
          AND em.armario_id = mv.armario_id
        ${whereClause}
        ORDER BY mv.data DESC;
      `;

      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("Erro ao buscar movimentações de medicamentos:", err);
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/insumos", async (req, res) => {
    try {
      const days = Number(req.query.days) || 0;
      let dateFilter = "";

      if (days > 0) {
        dateFilter = `AND mv.data >= NOW() - INTERVAL '${days} DAYS'`;
      }

      const query = `
        SELECT
          mv.id,
          i.nome AS name,
          i.descricao AS "additionalData",
          mv.quantidade AS quantity,
          l.login AS operator,
          mv.data AS "movementDate",
          a.num_armario AS cabinet,
          mv.tipo AS type
        FROM MOVIMENTACAO mv
        JOIN login l ON l.id = mv.login_id
        JOIN insumo i ON i.id = mv.insumo_id
        JOIN armario a ON a.num_armario = mv.armario_id
        LEFT JOIN ESTOQUE_INSUMO ei 
          ON ei.insumo_id = mv.insumo_id
          AND ei.armario_id = mv.armario_id
        WHERE mv.insumo_id IS NOT NULL
          ${dateFilter}
        ORDER BY mv.data DESC;
      `;

      const result = await pool.query(query);
      res.status(200).json(result.rows);
    } catch (err: any) {
      console.error("Erro ao buscar movimentações de insumos:", err);
      res.status(500).json({
        error: `Erro ao buscar movimentações de insumos: ${err.message ?? err}`,
      });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const {
        tipo, // 'entrada' ou 'saida'
        medicamento_id,
        insumo_id,
        quantidade,
        armario_id,
        casela_id,
        login_id,
        validade_medicamento,
      } = req.body;

      const query = `
        INSERT INTO movimentacao (
          tipo, medicamento_id, insumo_id, quantidade,
          armario_id, casela_id, login_id, data, validade_medicamento
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
        RETURNING *;
      `;

      const values = [
        tipo,
        medicamento_id,
        insumo_id,
        quantidade,
        armario_id,
        casela_id,
        login_id,
        validade_medicamento,
      ];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      console.error("Erro ao inserir movimentação:", err);
      res.status(500).json({ error: err.message });
    }
  });

  export default router;
