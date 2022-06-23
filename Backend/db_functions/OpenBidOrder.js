import { pubsub } from "../src/apolloServer.js";
import { pool } from "../src/postgreServer.js";

export const readOpenBidOrders = async ({symbol}) => {
	var queryString = `SELECT * FROM open_bid_orders_${symbol} ORDER BY price DESC LIMIT 5`
	const res = await pool.query(queryString)
	return res.rows.length ? res.rows : null
}

export const getOpenBidOrdersForSymbolAndUser = async ({symbol, owner}) => {
	var queryString = `SELECT * FROM OPEN_BID_ORDERS_${symbol}`
    if (owner) queryString = `SELECT * FROM OPEN_BID_ORDERS_${symbol} WHERE owner=${owner}`
	const res = await pool.query(queryString)
	return res.rows.length ? res.rows : null
}