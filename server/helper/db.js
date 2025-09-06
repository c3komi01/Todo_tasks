import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg
const env = process.env.NODE_ENV || 'development'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: env === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
})


pool.on('error', (err) => {
  console.error('PG pool error:', err.message)
})

export { pool }
