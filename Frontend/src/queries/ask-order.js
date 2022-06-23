import { gql } from "@apollo/client";

export const ASK_ORDER_BOOK_QUERY = gql`
    query GetOpenAskOrdersForSymbol($symbol: String!) {
        getOpenAskOrdersForSymbol(symbol: $symbol) {
            orderid
            walletid
            owner
            quantity
            symbol
            price
            openquantity
            fillcost
            createdat
            updatedat
        }
    }
`

export const ASK_ORDER_BOOK_SUBSCRIPTION = gql`
    subscription OnAskOrderUpdate($symbol: String!) {
        newAskOpenOrder(symbol: $symbol) {
            orderid
            walletid
            owner
            quantity
            symbol
            price
            openquantity
            fillcost
            createdat
            updatedat
        }
    }
`