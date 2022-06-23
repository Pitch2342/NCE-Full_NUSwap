import { gql } from "apollo-server";
import { createModule } from "graphql-modules";
import jwt from "jsonwebtoken"
import { createUser, readUser, updateUser, addBalance, getUserBalance } from "../db_functions/User.js";

const UserModule = createModule({
	id: 'user',
	typeDefs: gql`
		type User {
			userid: ID!
			name: String!
			email: String!
			password: String!
			phone: String
			balance: Float!
		}
		type Query {
			currentUser: User
			getAllUsers: [User!]
			getUserById(userid: ID!): User
			getUserByEmail(email: String!): User
			getUserBalance(userid: ID!): Float
		},
		type Mutation {
			login(email: String!, password: String!): HTTPResponse
			createUser(name: String!, email: String!, password: String!, phone: String): HTTPResponse
			updateUserDetails(name: String!, email: String!, phone: String): HTTPResponse
			updateUserPassword(password: String!): HTTPResponse,
			addBalance(userid: ID!, amount: Float!): HTTPResponse
		}
	`,
	resolvers: {
		Query: {
			currentUser: (p, a, c) => readUser(true, c),
			getAllUsers: (p, a, c) => readUser(false, {}),
			getUserById: (p, a, c) => readUser(true, a),
			getUserByEmail: (p, a, c) => readUser(true, a),
			getUserBalance: (p, a, c) => getUserBalance(a)
		},
		Mutation: {
			login: async (p, a, c) => {
				const user = await readUser(true, a)
				if (user.password !== a.password) return { status: 400, error: "Incorrect login details" }
				const token = jwt.sign({
					userid: user.userid,
					email: user.email
				}, "nuscrypex")
				return { status: 201, response: token}
			},
			createUser: (p, a, c) => createUser(a),
			updateUserDetails: (p, a, c) => updateUser(c.userid, a),
			updateUserPassword: (p, a, c) => updateUser(c.userid, a),
			addBalance: (p, a, c) => addBalance(a)
		}
	}
})

export default UserModule