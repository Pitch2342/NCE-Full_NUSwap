import { pool } from "../src/postgreServer.js";
import jwt from "jsonwebtoken"
import { createWallet } from "./Wallet.js";

export const createUser = async ({ name, email, password, phone }) => {
	try {
		const res = await pool.query(
			`INSERT INTO users (name, email, password, phone, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[name, email, password, phone, 10000.0] // init balance of $10,000
		)
		const token = jwt.sign({
			userid: res.rows[0].userid,
			email: res.rows[0].email
		}, "nuscrypex")
		createWallet(res.rows[0])
		return { status: 201, response: token }
	} catch (err) { return { status: 409, error: err.detail } }
}

export const readUser = async (single, { userid, email }) => {
	// console.log(userid)
	// console.log(email)
	var queryString = 'SELECT * FROM users ORDER BY userid DESC'
	if (userid) queryString = `SELECT * FROM users WHERE userid='${userid}'`
	if (email) queryString = `SELECT * FROM users WHERE email='${email}'`
	const res = await pool.query(queryString)
	// console.log(res.rows[0])
	return res.rows.length ? single ? res.rows[0] : res.rows : null
}

export const updateUser = async (userid, params) => {
	console.log(userid)
	console.log(params)
	var queryString = `UPDATE users SET `
	for (const key in params) {
		queryString += `${key} = '${params[key]}', `
	}
	queryString = queryString.replace(/, $/, '');
	queryString += ` WHERE userid='${userid}' RETURNING *`
	try {
		const res = await pool.query(queryString)
		return res.rows.length ? { status: 200, response: res.rows[0].userid } : { status: 409, error: "Record doesn't exist" }
	} catch (err) { return { status: 409, error: err.detail } }
}

export const addBalance = async (params) => {
	try {
		const res = await pool.query(
			`UPDATE USERS SET BALANCE = BALANCE + ${params['amount']} WHERE userid=${params['userid']} RETURNING *`
		)
		return { status: 200, response: "ADDED BALANCE" }
	}
	catch (err) {
		return { status: 409, error: "FAILED BALANCE ADD" }
	}
}

export const getUserBalance = async ({ userid }) => {
	var queryString = `SELECT * FROM USERS WHERE userid=${userid}`
	const res = await pool.query(queryString)
	return res.rows.length ? res.rows[0].balance : 0
}