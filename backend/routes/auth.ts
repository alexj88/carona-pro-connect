import { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { query } from "../db.js";


const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Rota POST para login com Google
router.post("/google", async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token não enviado" });

  try {
    // Verifica token com Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: "Token inválido" });

    const { email, name, picture } = payload;

    // Verifica se usuário já existe no banco
    const userQuery = await query("SELECT * FROM Usuario WHERE email = $1", [email]);

    let user;
    if (userQuery.rows.length > 0) {
      user = userQuery.rows[0]; // usuário já existe
    } else {
      // Cria novo usuário
      const insertQuery = await query(
        "INSERT INTO Usuario (nome, email, foto) VALUES ($1, $2, $3) RETURNING *",
        [name, email, picture]
      );
      user = insertQuery.rows[0];
    }

    // Retorna usuário para o frontend
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao processar login Google" });
  }
});

export default router;
