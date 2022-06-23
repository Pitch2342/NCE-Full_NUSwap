import { gql } from "apollo-server";
import { createModule } from "graphql-modules";
import { addOrder } from "../src/rabbitmq.js";


const OrderModule = createModule({
    id: 'order',
    typeDefs: gql`
        type Order {
            symbol:String!
            type:String!
            side:String!
            quantity:Float!
            price:Float!
            ownerId:Int!
            walletId:Int!
        }

		type Mutation {
			createOrder(symbol: String!, type: String!, side: String!, quantity: Float!, price: Float!, ownerId: Int!, walletId: Int!): HTTPResponse
		}

	`,
    resolvers: {
        Mutation: {
            createOrder: async (p, a, c) => {
                return await addOrder(a);
            }
        }
    }
})

export default OrderModule