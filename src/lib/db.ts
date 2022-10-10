import { Pool } from "pg"

let poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
}

let connection = new Pool(poolConfig)

export default connection
