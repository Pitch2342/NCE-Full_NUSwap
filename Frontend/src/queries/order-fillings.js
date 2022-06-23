import { gql } from "@apollo/client"

export const NEW_ORDER_FILLED_SUBSCRIPTION = gql`
	subscription NewOrderFilled($symbol: String!) {
		newOrderFilled(symbol: $symbol) {
			time
			price
			quantity
		}
	}
`