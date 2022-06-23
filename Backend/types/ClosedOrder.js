import { gql } from "apollo-server";
import { createModule } from "graphql-modules";
import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../src/apolloServer.js";
import { getClosedOrdersForSymbolAndUser } from "../db_functions/ClosedOrder.js";

const ClosedOrderModule = createModule({
	id: 'closed-order',
	typeDefs: gql`
		type ClosedOrder {
			orderid: ID!
            walletid: ID!
            owner: ID!
            buyside: String!
            quantity: Float!
            symbol: String!
            price: Float!
            fillcost: Float!
            fillprice: Float!
            createdat: String!
            filledat: String!
		}

		type Query {
			getClosedOrdersForSymbolAndUser(symbol: String!, owner: ID): [ClosedOrder!]
		}

	`,
	resolvers: {
		Query: {
			getClosedOrdersForSymbolAndUser: (p, a, c) => getClosedOrdersForSymbolAndUser(a)
		}
	}
})

export default ClosedOrderModule
