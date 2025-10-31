import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env
dotenv.config();

// O 'pg' lê automaticamente as variáveis de ambiente que começam com PG_
// (PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT)
const pool = new Pool();

console.log('Pool de conexões com o PostgreSQL criado.');

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;