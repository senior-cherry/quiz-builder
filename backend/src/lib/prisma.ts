import { Pool } from 'pg';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client/extension';
import type { PrismaClientOptions } from '@prisma/client/runtime/client';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: {
    query: async (text: string, params?: unknown[] | undefined) => {
      const result = await pool.query(text, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
      };
    },
    transaction: async (callback: (client: unknown) => Promise<unknown>) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
  } as unknown as PrismaClientOptions,
});

export default prisma;
