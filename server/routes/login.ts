import { Router } from "express";
import { pool } from "../../client/db/connection";

const router = Router();

router.post("/", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO login (login, password) VALUES ($1, $2) RETURNING id, login",
      [login, password],
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.message.includes("duplicate key")) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ error: `Erro ao cadastrar usuário` });
  }
});

router.get("/", async (req, res) => {
  const { login, password } = req.query;

  if (!login || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "SELECT id, login FROM login WHERE login = $1 AND password = $2",
      [login, password],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { login, password, currentLogin, currentPassword } = req.body;

  if (!login || !password || !currentLogin || !currentPassword) {
    return res
      .status(400)
      .json({
        error:
          "E-mail atual, senha atual, novo e-mail e nova senha são obrigatórios",
      });
  }

  try {
    const verify = await pool.query(
      "SELECT id FROM login WHERE id = $1 AND login = $2 AND password = $3",
      [id, currentLogin, currentPassword],
    );

    if (verify.rowCount === 0) {
      return res
        .status(401)
        .json({ error: "E-mail ou senha atual incorretos" });
    }

    const result = await pool.query(
      "UPDATE login SET login = $1, password = $2 WHERE id = $3 RETURNING id, login",
      [login, password, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    if (err.message.includes("duplicate key")) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Optional: delete user (account removal)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM login WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "E-mail e nova senha são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "UPDATE login SET password = $1 WHERE login = $2 RETURNING id, login",
      [newPassword, email],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao resetar senha" });
  }
});

export default router;
