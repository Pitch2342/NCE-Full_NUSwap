import { gql } from "@apollo/client";

export const MARKET_HISTORY_QUERY = gql`
	query GetMarketHistoryForSymbol($symbol: String!) {
		getMarketHistoryForSymbol(symbol: $symbol) {
			time
			open
			close
			high
			low
			volume
		}
	}
`