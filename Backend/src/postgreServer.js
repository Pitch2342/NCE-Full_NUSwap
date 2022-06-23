import pg from "pg"
const { Pool } = pg

export const pool = new Pool({
	user: 'nus',
	host: 'localhost',
	database: 'nustesting',
	password: '12345678',
	port: 5432
})

