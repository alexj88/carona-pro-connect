import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db'; // Importa nossa função de query

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Define uma porta para o backend

// === Middlewares ===
// Habilita o CORS para que o frontend (Vite em localhost:5173) possa fazer requisições
app.use(cors()); 

// Habilita o parseamento de JSON no corpo das requisições (para POST, PUT, PATCH)
app.use(express.json());

// === Rotas da API ===

// Rota de "saúde" para verificar se a API está no ar
app.get('/api', (req, res) => {
  res.json({ message: 'API do Carona Pro Connect está funcionando!' });
});

// Rota de exemplo para buscar motoristas (exemplo)
app.get('/api/motoristas', async (req, res) => {
  try {
    // ATENÇÃO: Você precisa criar essa tabela 'motoristas' no seu banco!
    const result = await query('SELECT * FROM motoristas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar motoristas' });
  }
});

// Rota de exemplo para criar um motorista (exemplo)
app.post('/api/motoristas', async (req, res) => {
  const { nome, veiculo } = req.body;

  if (!nome || !veiculo) {
    return res.status(400).json({ error: 'Nome e veículo são obrigatórios' });
  }

  try {
    const result = await query(
      'INSERT INTO motoristas (nome, veiculo) VALUES ($1, $2) RETURNING *',
      [nome, veiculo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar motorista' });
  }
});


// === Iniciar o Servidor ===
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});