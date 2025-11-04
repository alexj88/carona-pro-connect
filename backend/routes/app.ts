import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js"; // sua rota de login Google

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);

// Rota teste
app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

// Inicia servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
