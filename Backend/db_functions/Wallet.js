import { pool } from "../src/postgreServer.js";

export const createWallet = async ({ userid }) => {
	try {
		const res = await pool.query(
			`INSERT INTO wallet (owner) VALUES ($1) RETURNING *`,
			[userid]
		)
		await pool.query(
			`INSERT INTO wallet_assets (walletid, symbol, amount) VALUES ($1, $2, $3) RETURNING *`,
			[userid, 'btcusd', 10.0]
		)
		return { status: 201, response: "New wallet created." }
	} catch (err) { return { status: 409, error: err.detail } }
}

export const readWallet = async (single, { walletid, owner }) => {
	var queryString = 'SELECT * FROM wallet ORDER BY walletid ASC'
	if (owner) queryString = `SELECT * FROM wallet WHERE owner='${owner}'`
	if (walletid) queryString = `SELECT * FROM wallet WHERE walletid='${walletid}'`
	const res = await pool.query(queryString)
	return res.rows.length ? single ? res.rows[0] : res.rows : null
}