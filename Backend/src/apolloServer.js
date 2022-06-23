import { ApolloServer, AuthenticationError } from "apollo-server-express";
import apolloApplication from "./apolloApplication.js";
import jwt from "jsonwebtoken"
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express";
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions';
import { ConsoleLogger } from "@cdm-logger/server";

const schema = apolloApplication.createSchemaForApollo()

const whitelisted = ['Login', 'CreateUser']

const getUser = token => {
	if (token) {
		try {
			return jwt.verify(token, "nuscrypex")
		} catch (err) {
			return null
		}
	}
}

const settings = {
	level: "info", // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
	mode: "short" // Optional: default 'short' ('short'|'long'|'dev'|'raw')
}

const logger = ConsoleLogger.create("nce", settings);


export const pubsub = new AmqpPubSub({
	logger,
});

const startApolloServer = async () => {
	const app = express()
	const httpServer = createServer(app)
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: '/graphql'
	})
	const serverCleanup = useServer({ schema }, wsServer)
	const apolloServer = new ApolloServer({
		schema,
		csrfPrevention: true,
		context: ({ req }) => {
			console.log(req.body.operationName)
			if (whitelisted.includes(req.body.operationName)) return {}
			const token = req.headers.authorization || 'Bearer null'
			if (!token.includes('Bearer ')) throw new AuthenticationError("Token must use Bearer format.")
			const user = getUser(token.split(' ')[1])
			if (!user) throw new AuthenticationError("You must be logged in.")
			return user
		},
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
			async ServerWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose()
					}
				}
			}
		}]
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({ app })
	await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
	console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`)
}

export default startApolloServer
