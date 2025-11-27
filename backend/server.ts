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
app.use(cors({
    origin: 'http://localhost:5173', // Isso permite apenas o frontend acessar
})); 

// Habilita o parseamento de JSON no corpo das requisições (para POST, PUT, PATCH)
app.use(express.json());

// === Rotas da API ===

// Rota de "saúde" para verificar se a API está no ar
app.get('/api', (req, res) => {
  res.json({ message: 'API do Carona Pro Connect está funcionando!' });
});

// Rota para buscar motoristas
app.get('/api/motoristas', async (req, res) => {
  try {
    const result = await query('SELECT * FROM motoristas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar motoristas' });
  }
});

// Rota para criar um motorista
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

// Rota para buscar um motorista por ID
app.get('/api/motoristas/:id', async (req, res) => {
    const motoristaId = req.params.id;

    try {
        const result = await query('SELECT * FROM motoristas WHERE id = $1', [motoristaId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Motorista não encontrado.' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar motorista por ID:', err);
        res.status(500).json({ error: 'Erro ao buscar motorista.' });
    }
});

// Rota para atualizar um motorista (PUT)
app.put('/api/motoristas/:id', async (req, res) => {
    const motoristaId = req.params.id;
    const { nome, email, veiculo, placa } = req.body;

    // Verificação de campos obrigatórios
    if (!nome || !email || !veiculo || !placa) {
        return res.status(400).json({ error: 'Nome, Email, Veículo e Placa são obrigatórios para atualização.' });
    }

    try {
        const result = await query(
            'UPDATE motoristas SET nome = $1, email = $2, veiculo = $3, placa = $4 WHERE id = $5 RETURNING *',
            [nome, email, veiculo, placa, motoristaId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Motorista não encontrado para atualização.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar motorista:', err);
        
        // Tratamento para email ou placa duplicados (violação UNIQUE)
        const pgError = err as any; 
        if (pgError.code === '23505') {
            return res.status(409).json({ error: 'Email ou Placa já estão em uso por outro registro.' });
        }
        
        res.status(500).json({ error: 'Erro interno ao atualizar motorista.' });
    }
});

// Rota para deletar um motorista (DELETE)
app.delete('/api/motoristas/:id', async (req, res) => {
    const motoristaId = req.params.id;

    try {
        const result = await query('DELETE FROM motoristas WHERE id = $1 RETURNING id', [motoristaId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Motorista não encontrado para remoção.' });
        }

        // Retorna 204 No Content para remoção bem-sucedida, sem corpo
        res.status(204).send(); 
        
    } catch (err) {
        console.error('Erro ao deletar motorista:', err);
        
        // Tratamento de erro comum: motorista tem corridas associadas (Foreign Key)
        const pgError = err as any; 
        if (pgError.code === '23503') { 
            return res.status(409).json({ error: 'Não é possível remover: O motorista tem corridas associadas.' });
        }

        res.status(500).json({ error: 'Erro interno ao deletar motorista.' });
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

// Rota para buscar um Usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
    const usuarioId = req.params.id;

    try {
        const result = await query('SELECT id, nome, email, telefone FROM usuarios WHERE id = $1', [usuarioId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar usuário por ID:', err);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// Rota para atualizar um Usuário (PUT)
app.put('/api/usuarios/:id', async (req, res) => {
    const usuarioId = req.params.id;
    const { nome, email, telefone } = req.body;

    // Verificação de campos obrigatórios (os campos 'NOT NULL' na tabela)
    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e Email são obrigatórios para atualização.' });
    }

    try {
        const result = await query(
            'UPDATE usuarios SET nome = $1, email = $2, telefone = $3 WHERE id = $4 RETURNING id, nome, email, telefone',
            [nome, email, telefone, usuarioId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        
        // Tratamento para email duplicado (violação UNIQUE)
        const pgError = err as any; 
        if (pgError.code === '23505') {
            return res.status(409).json({ error: 'Este email já está em uso por outro usuário.' });
        }
        
        res.status(500).json({ error: 'Erro interno ao atualizar usuário.' });
    }
});

// Rota para deletar um Usuário (DELETE)
app.delete('/api/usuarios/:id', async (req, res) => {
    const usuarioId = req.params.id;

    try {
        const result = await query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [usuarioId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado para remoção.' });
        }

        // Retorna 204 No Content para remoção bem-sucedida
        res.status(204).send(); 
        
    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        
        // Tratamento de erro: O usuário tem corridas associadas (Foreign Key)
        const pgError = err as any; 
        if (pgError.code === '23503') { 
            return res.status(409).json({ error: 'Não é possível remover: O usuário tem corridas associadas registradas.' });
        }

        res.status(500).json({ error: 'Erro interno ao deletar usuário.' });
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

// Rota para buscar UMA Corrida por ID
app.get('/api/corridas/:id', async (req, res) => {
    const corridaId = req.params.id;

    try {
        const result = await query(
            'SELECT * FROM corridas WHERE id = $1',
            [corridaId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Corrida não encontrada.' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao buscar corrida por ID:', err);
        res.status(500).json({ error: 'Erro ao buscar corrida.' });
    }
});

// Rota para Motorista ACEITAR a Corrida (Atualiza motorista_id e status)
app.put('/api/corridas/:id/aceitar', async (req, res) => {
    const corridaId = req.params.id;
    const { motorista_id } = req.body; // ID do motorista que aceitou

    if (!motorista_id) {
        return res.status(400).json({ error: 'O ID do motorista é obrigatório para aceitar a corrida.' });
    }
    
    try {
        const result = await query(
            'UPDATE corridas SET motorista_id = $1, status = $2 WHERE id = $3 AND status = $4 RETURNING *',
            [motorista_id, 'aceita', corridaId, 'solicitada']
        );

        if (result.rows.length === 0) {
            // Pode ser 404 (não existe) ou 409 (status errado)
            const check = await query('SELECT status FROM corridas WHERE id = $1', [corridaId]);
            if (check.rows.length === 0) {
                 return res.status(404).json({ error: 'Corrida não encontrada.' });
            }
            return res.status(409).json({ error: `Corrida não pode ser aceita. Status atual: ${check.rows[0].status}.` });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao aceitar corrida:', err);
        // Erro 23503: violação de chave estrangeira (motorista_id não existe)
        const pgError = err as any; 
        if (pgError.code === '23503') { 
            return res.status(400).json({ error: 'ID do Motorista inválido.' });
        }
        res.status(500).json({ error: 'Erro interno ao aceitar corrida.' });
    }
});


// Rota genérica para atualizar o status da corrida (usado para em_andamento/concluida/cancelada)
app.put('/api/corridas/:id/status', async (req, res) => {
    const corridaId = req.params.id;
    const { status } = req.body; 

    const statusValidos = ['em_andamento', 'concluida', 'cancelada'];

    if (!status || !statusValidos.includes(status)) {
        return res.status(400).json({ error: 'Status inválido. Use: em_andamento, concluida, ou cancelada.' });
    }

    // Se for 'concluida', registra a data de conclusão
    const dataConclusao = (status === 'concluida') ? 'CURRENT_TIMESTAMP' : 'NULL';

    try {
        const result = await query(
            `UPDATE corridas SET status = $1, data_conclusao = ${dataConclusao} WHERE id = $2 RETURNING *`,
            [status, corridaId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Corrida não encontrada para atualização.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar status da corrida:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar status da corrida.' });
    }
});


// Rota para deletar uma Corrida (DELETE)
app.delete('/api/corridas/:id', async (req, res) => {
    const corridaId = req.params.id;

    try {
        const result = await query('DELETE FROM corridas WHERE id = $1 RETURNING id', [corridaId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Corrida não encontrada para remoção.' });
        }

        res.status(204).send(); 
        
    } catch (err) {
        console.error('Erro ao deletar corrida:', err);
        res.status(500).json({ error: 'Erro interno ao deletar corrida.' });
    }
});

// Rota para buscar todas as Corridas Solicitadas (disponíveis para aceitar)
app.get('/api/corridas/disponiveis', async (req, res) => {
    try {
        const result = await query(
            `SELECT 
                c.id, c.origem, c.destino, c.data_solicitacao,
                u.nome AS passageiro_nome, u.email AS passageiro_email, u.telefone AS passageiro_telefone
             FROM corridas c
             JOIN usuarios u ON c.passageiro_id = u.id
             WHERE c.motorista_id IS NULL AND c.status = 'solicitada'
             ORDER BY c.data_solicitacao DESC;`
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar caronas disponíveis:', err);
        res.status(500).json({ error: 'Erro interno ao buscar caronas disponíveis.' });
    }
});

// === Iniciar o Servidor ===
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});