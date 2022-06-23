import { pubsub } from "../src/apolloServer.js";
import { pool } from "../src/postgreServer.js";

export const createOrderFilling = async ({symbol, quantity, price}) => {
	try {
		const res = await pool.query(
			`INSERT INTO order_fillings_$1 (quantity, price) VALUES ($2, $3) RETURNING time, symbol, quantity, price`,
			[symbol, quantity, price]
		)
		pubsub.publish('NEW_ORDER_FILLED', { newOrder: res.rows[0] })
		return { status: 201, response: "New order filling data added." }
	} catch (err) { console.log(err); return { status: 409, error: err.detail } }
}

export const readOrderFillings = async (single, {symbol}) => {
	var queryString = 'SELECT time, symbol, quantity, price FROM order_fillings_btcusd ORDER BY time ASC'
	if (symbol) queryString = `SELECT time, symbol, quantity, price FROM order_fillings_${symbol}`
	const res = await pool.query(queryString)
	return res.rows.length ? single ? res.rows[0] : res.rows : null
}