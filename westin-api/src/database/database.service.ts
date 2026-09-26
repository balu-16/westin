import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { env } from '../config/env';

/**
 * Thin wrapper around node-postgres. All SQL in this codebase is hand-written
 * and parameterized — there is no ORM by design.
 */

/**
 * The Supabase pooler hands out a fixed number of client slots (pool_size: 15 on
 * the session pooler) shared by everything that connects — every Vercel
 * instance plus local dev. A per-instance `max` larger than that guarantees
 * `EMAXCONNSESSION: max clients reached`, and `onModuleInit` then throws, so
 * the function fails to boot with FUNCTION_INVOCATION_FAILED. Keep the
 * per-instance pool small and configurable; multiply it by the number of
 * concurrent instances and keep the result under the pooler's pool_size.
 */
const POOL_MAX = Math.max(1, Number(process.env.DB_POOL_MAX ?? 3) || 3);
const INIT_ATTEMPTS = 3;
const INIT_BACKOFF_MS = 1_000;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: POOL_MAX,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 8_000,
      query_timeout: 8_000,
    });
    this.pool.on('error', (err) => console.error('[pg pool error]', err.message));
  }

  async onModuleInit() {
    // A cold start can land while the shared pooler is momentarily saturated by
    // other instances. Retry before giving up so one busy moment does not take
    // the whole API down.
    let lastError: unknown;
    for (let attempt = 1; attempt <= INIT_ATTEMPTS; attempt++) {
      try {
        await this.query('select 1');
        return;
      } catch (err) {
        lastError = err;
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[db] init attempt ${attempt}/${INIT_ATTEMPTS} failed: ${message}`);
        if (attempt < INIT_ATTEMPTS) {
          await new Promise((resolve) => setTimeout(resolve, INIT_BACKOFF_MS * attempt));
        }
      }
    }
    throw lastError;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.pool.query(sql, params as any[]).then((r) => r.rows as T[]);
  }

  async queryOne<T = any>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  /** Run a callback inside a transaction; rolls back on any thrown error. */
  async tx<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('begin');
      const result = await fn(client);
      await client.query('commit');
      return result;
    } catch (err) {
      await client.query('rollback').catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
  }
}
