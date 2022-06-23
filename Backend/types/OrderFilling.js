import { gql } from "apollo-server";
import { createModule } from "graphql-modules";
import { withFilter } from "graphql-subscriptions";
import { updateMarketHistory } from "../db_functions/MarketHistory.js";
import { createOrderFilling, readOrderFillings } from "../db_functions/OrderFilling.js";
import { pubsub } from "../src/apolloServer.js";

const OrderFillingModule = createModule({
	id: 'order-filling',
	typeDefs: gql`
		type OrderFilling {
			time: String!
			symbol: String!
			quantity: Float!
			price: Float!
		}

		type Query {
			getOrderFillingsForSymbol(symbol: String!): [OrderFilling!]
		}

		type Mutation {
			createOrderFilling(symbol: String!, quantity: Float!, price: Float!): HTTPResponse
		}

		type Subscription {
			newOrderFilled(symbol: String!): OrderFilling
		}

	`,
	resolvers: {
		Query: {
			getOrderFillingsForSymbol: (p, a, c) => readOrderFillings(false, a)
		},
		Mutation: {
			createOrderFilling: (p, a, c) => {
				updateMarketHistory(a)
				return createOrderFilling(a)
			}
		},
		Subscription: {
			newOrderFilled: {
				subscribe: withFilter(
					() => pubsub.asyncIterator(['NEW_ORDER_FILLED']),
					(payload, variables) => {
						return payload.symbol === variables.symbol || variables.symbol === ''
					}
				)
			}
		}
	}
})

export default OrderFillingModule