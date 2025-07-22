import * as Path from 'node:path'

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
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  },
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
}}