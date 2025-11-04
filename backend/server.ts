import dotenv from 'dotenv';
// Carrega as variáveis de ambiente
dotenv.config();

import express from 'express';
import cors from 'cors';
import { query } from './db.js'; // Importa nossa função de query

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
  const { nome, email, veiculo, placa } = req.body;

  if (!nome || !email || !veiculo || !placa) {
    return res.status(400).json({ error: 'Nome, Email, Veículo e Placa são obrigatórios' });
  }

  try {
    const result = await query(
      'INSERT INTO motoristas (nome, email, veiculo, placa) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, veiculo, placa]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar motorista' });
  }
});

//Criar um novo Usuário (Passageiro)
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios para o usuário.' });
    }

    try {
        const result = await query(
            'INSERT INTO usuarios (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id, nome, email, telefone',
            [nome, email, telefone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao criar usuário:', err);

          // VERIFICAÇÃO DE TIPO NECESSÁRIA PELO TYPESCRIPT
    if (err instanceof Error) {
        // Tenta acessar a propriedade 'code' se estiver disponível
        // É comum que o erro do PG tenha a propriedade 'code' direto no objeto erro
        const pgError = err as any;
        // O código de erro '23505' é para violação de UNIQUE (ex: email já existe
        if (pgError.code === '23505') {
            return res.status(409).json({ error: 'Este email já está cadastrado.' });
        }
      }
      // Se não for um erro PG conhecido, ou não for um objeto Error
        res.status(500).json({ error: 'Erro interno ao criar usuário.' });
    }
});

// Buscar todos os Usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await query('SELECT id, nome, email, telefone FROM usuarios');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

// Solicitar uma nova Corrida
app.post('/api/corridas', async (req, res) => {
    const { passageiro_id, origem, destino } = req.body;

    if (!passageiro_id || !origem || !destino) {
        return res.status(400).json({ error: 'ID do passageiro, origem e destino são obrigatórios.' });
    }

    try {
        // A corrida começa com status 'solicitada' e motorista_id nulo
        const result = await query(
            'INSERT INTO corridas (passageiro_id, origem, destino) VALUES ($1, $2, $3) RETURNING *',
            [passageiro_id, origem, destino]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao solicitar corrida:', err);
        res.status(500).json({ error: 'Erro ao solicitar corrida.' });
    }
});

// Buscar Corridas por Passageiro
app.get('/api/corridas/passageiro/:id', async (req, res) => {
    const passageiroId = req.params.id;

    try {
        const result = await query(
            'SELECT * FROM corridas WHERE passageiro_id = $1 ORDER BY data_solicitacao DESC',
            [passageiroId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(`Erro ao buscar corridas para o passageiro ${passageiroId}:`, err);
        res.status(500).json({ error: 'Erro ao buscar corridas.' });
    }
});

// === Iniciar o Servidor ===
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});