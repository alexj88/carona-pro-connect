import { query } from "./db.js";

(async () => {
  try {
    const res = await query("SELECT NOW()");
    console.log("✅ Banco conectado com sucesso:", res.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  }
})();
