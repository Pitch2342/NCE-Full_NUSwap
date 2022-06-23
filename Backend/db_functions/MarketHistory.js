import { pubsub } from "../src/apolloServer.js";
import { pool } from "../src/postgreServer.js";

export const updateMarketHistory = async ({symbol, price, quantity}) => {
	try {
		const res = await pool.query(
			`INSERT INTO market_history_$1 (open, close, high, low, volume, time) VALUES ($2, $2, $2, $2, $3, date_trunc('minute'::text, now())) ON CONFLICT (time) DO UPDATE SET high = GREATEST(market_history.high, $2), low = LEAST(market_history.low, $2), close = $2, volume = market_history.volume + $3 RETURNING time, open, close, high, low, volume`,
			[symbol, price, quantity]
		)
		pubsub.publish('MH_UPDATED', { marketHistoryUpdated: res.rows[0] })
		return { status: 201, response: "Market history data added." }
	} catch (err) { console.log(err); return { status: 409, error: err.detail } }
}

export const readMarketHistory = async (single, {symbol}) => {
	var queryString = 'SELECT time, open, close, high, low, volume FROM market_history_btcusd ORDER BY time ASC'
	if (symbol) queryString = `SELECT time, open, close, high, low, volume FROM market_history_${symbol}`
	const res = await pool.query(queryString)
	return res.rows.length ? single ? res.rows[0] : res.rows : null
}