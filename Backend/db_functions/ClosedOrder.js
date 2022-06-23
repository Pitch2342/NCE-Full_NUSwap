import { pubsub } from "../src/apolloServer.js";
import { pool } from "../src/postgreServer.js";

export const getClosedOrdersForSymbolAndUser = async ({symbol, owner}) => {
	var queryString = `SELECT * FROM CLOSED_ORDERS_${symbol}`
    if (owner) queryString = `SELECT * FROM CLOSED_ORDERS_${symbol} WHERE owner=${owner}`
	const res = await pool.query(queryString)
	return res.rows.length ? res.rows : null
}

