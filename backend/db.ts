import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Cria o objeto de configuração usando process.env
// Isso força o Pool a usar suas variáveis personalizadas
const connectionConfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432', 10), // Converte a porta para número, usando 5432 como fallback
};

// Passa a configuração explicitamente
const pool = new Pool(connectionConfig);

console.log('Pool de conexões com o PostgreSQL criado.');
console.log(`Tentando conectar no banco ${process.env.PG_DATABASE} na porta ${process.env.PG_PORT}`);

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;