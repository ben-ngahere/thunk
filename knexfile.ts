import * as Path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename) 

export default {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: Path.join(__dirname, 'server', 'db', 'database.sqlite'), 
    },
    migrations: {
      directory: Path.join(__dirname, 'server', 'db', 'migrations'), 
    },
    seeds: {
      directory: Path.join(__dirname, 'server', 'db', 'seeds'), 
    },
  },

  production: {
    client: 'pg',
    useNullAsDefault: true,
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: Path.join(__dirname, 'server', 'db', 'migrations'), 
    },
    seeds: {
      directory: Path.join(__dirname, 'server', 'db', 'seeds'), 
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};