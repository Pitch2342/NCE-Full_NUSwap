import { pool } from "../src/postgreServer.js";

export const updateWalletAsset = async ({walletid, symbol, amount}) => {
	try {
		const res = await pool.query(
			`INSERT INTO wallet_assets (walletid, symbol, amount) VALUES ($1, $2, $3) ON CONFLICT (walletid, symbol) DO UPDATE SET amount = wallet_assets.amount + $3 RETURNING *`,
			[walletid, symbol, amount]
		)
		return { status: 201, response: "New wallet created." }
	} catch (err) { return { status: 409, error: err.detail } }
}

export const readWalletAsset = async (single, {walletid, symbol}) => {
	var queryString = 'SELECT * FROM wallet_assets ORDER BY walletid ASC'
	if (walletid) queryString = `SELECT * FROM wallet_assets WHERE walletid='${walletid}'`
	if (symbol) queryString = `SELECT * FROM wallet_assets WHERE symbol='${symbol}'`
	if (walletid && symbol) queryString = `SELECT * FROM wallet_assets WHERE (walletid='${walletid}' AND symbol='${symbol}')`
	const res = await pool.query(queryString)
	return res.rows.length ? single ? res.rows[0] : res.rows : null
}

export const getWalletAssetsWalletID = async ({walletid}) => {
	var queryString = `SELECT * FROM WALLET_ASSETS WHERE walletid=${walletid}`
	const res = await pool.query(queryString)
	return res.rows.length ? res.rows : null
}