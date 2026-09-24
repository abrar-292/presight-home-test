/**
 * Centralised environment configuration.
 * All modules must import from here — no raw process.env calls elsewhere.
 */
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
  dbPath: process.env.DB_PATH,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
  seedCount: process.env.SEED_COUNT ? parseInt(process.env.SEED_COUNT, 10) : 3000,
} as const;

export default config;
