import { gql } from "@apollo/client";

export const CLOSED_ORDER_USER_QUERY = gql`
    query GetClosedOrdersForSymbolAndUser($symbol: String!, $owner: ID) {
    getClosedOrdersForSymbolAndUser(symbol: $symbol, owner: $owner) {
        orderid
        buyside
        quantity
        price
        fillprice
        createdat
        filledat
    }
    }
`

export const OPEN_ASK_ORDER_USER_QUERY = gql`
    query GetOpenAskOrdersForSymbolAndUser($symbol: String!, $owner: ID) {
    getOpenAskOrdersForSymbolAndUser(symbol: $symbol, owner: $owner) {
        orderid
        quantity
        price
        openquantity
        fillcost
        createdat
        updatedat
    }
    }
`

export const OPEN_BID_ORDER_USER_QUERY = gql`
    query GetOpenBidOrdersForSymbolAndUser($symbol: String!, $owner: ID) {
    getOpenBidOrdersForSymbolAndUser(symbol: $symbol, owner: $owner) {
        orderid
        quantity
        price
        openquantity
        fillcost
        createdat
        updatedat
    }
    }
`

export const WALLET_ASSETS_USER_QUERY = gql`
    query GetWalletAssetsWalletID($walletid: ID!) {
    getWalletAssetsWalletID(walletid: $walletid) {
        walletid
        symbol
        amount
    }
    }
`

export const ADD_BALANCE_MUTATION = gql`
	mutation AddBalance($userid: ID!, $amount: Float!) {
		addBalance(userid: $userid, amount: $amount) {
			status
			response
			error
		}
	}
`

export const GET_USER_BALANCE = gql`
    query GetUserBalance($userid: ID!) {
    getUserBalance(userid: $userid)
    }
`