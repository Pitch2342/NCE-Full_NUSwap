import { gql } from "@apollo/client";

export const BID_ORDER_BOOK_QUERY = gql`
    query GetOpenBidOrdersForSymbol($symbol: String!) {
        getOpenBidOrdersForSymbol(symbol: $symbol) {
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

export const BID_ORDER_BOOK_SUBSCRIPTION = gql`
    subscription OnBidOrderUpdate($symbol: String!) {
        newBidOpenOrder(symbol: $symbol) {
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