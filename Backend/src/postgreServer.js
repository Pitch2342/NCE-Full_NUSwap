import pg from "pg"
const { Pool } = pg

export const pool = new Pool({
	user: 'admin',
	host: 'localhost',
	database: 'nuswap',
	password: 'ncepassword',
	port: 5432
})

