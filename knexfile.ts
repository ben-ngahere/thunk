// server/knexfile.ts
import * as Path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

export default {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      // Adjusted path if your database.sqlite is directly in server/db
      filename: Path.join(__dirname, 'db', 'database.sqlite'), // Assuming 'db' is directly under 'server'
    },
    migrations: {
      directory: Path.join(__dirname, 'db', 'migrations'), // Assuming 'migrations' is directly under 'server/db'
    },
    seeds: {
      directory: Path.join(__dirname, 'db', 'seeds'), // Assuming 'seeds' is directly under 'server/db'
    },
  },

  // ADD THIS PRODUCTION CONFIGURATION
  production: {
    client: 'pg', // Specify PostgreSQL client
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL, // Knex will read this from environment variables
    migrations: {
      directory: Path.join(__dirname, 'db', 'migrations'), // Path to your migrations for production
    },
    seeds: {
      directory: Path.join(__dirname, 'db', 'seeds'), // Path to your seeds for production
    },
    // Optional: Add a pool for production connections
    pool: {
      min: 2,
      max: 10,
    },
  },
};