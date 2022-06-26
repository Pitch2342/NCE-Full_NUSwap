import { Stack, Title } from "@mantine/core";
import React from "react";
import { colors } from "../../../constants/colors";
// import createWebSocket, { orderBookOnMessage } from "../../../services/createWebSocket";
import { ExchangeTable } from "../ExchangeTable/ExchangeTable";
import { useQuery } from '@apollo/client'
import { ASK_ORDER_BOOK_QUERY, ASK_ORDER_BOOK_SUBSCRIPTION } from "../../../queries/ask-order.js";
import { BID_ORDER_BOOK_QUERY, BID_ORDER_BOOK_SUBSCRIPTION } from "../../../queries/bid-order.js";

const OrderBook = ({ symbol }) => {
  const currencyArray = symbol.toUpperCase().match(/.{1,3}/g);

  const { subscribeToMore, ...asks } = useQuery(ASK_ORDER_BOOK_QUERY, { variables: { symbol } })
  const bids = useQuery(BID_ORDER_BOOK_QUERY, { variables: { symbol } })
  // console.log("BIDS ",bids.data)
  // console.log("ASKS ",asks.data ? asks.data.getOpenAskOrdersForSymbol.map((order) => [order.price, order.openquantity]) : [])
  // console.log(asks.length)
  // console.log(bids.length)
  // if (asks.data) {console.log("AD ",asks.data)}
  // if (asks.data) {console.log("ADG ",asks.data.getOpenAskOrdersForSymbol)}

  return (
    <Stack>
      <Title order={3}>Order Book</Title>
      {asks.data ? ( asks.data.getOpenAskOrdersForSymbol ?
        <ExchangeTable title={"asks"} currencyArray={currencyArray} arr={asks.data ? asks.data.getOpenAskOrdersForSymbol.map((order) => [order.price, order.openquantity]) : []} color={colors.red(1)}
          subscribeToNewOrderBook={
            () => subscribeToMore({
              document: ASK_ORDER_BOOK_SUBSCRIPTION,
              variables: { symbol },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                return subscriptionData.data.newAskOpenOrder
              }
            })
          }
        />
      : <div>Empty Ask Orderbook</div>) : (
        <div>No Asks</div>
      )}
      {bids.data ? ( bids.data.getOpenBidOrdersForSymbol ? 
        <ExchangeTable title={"bids"} currencyArray={currencyArray} arr={bids.data ? bids.data.getOpenBidOrdersForSymbol.map((order) => [order.price, order.openquantity]) : []} color={colors.green(1)}
          subscribeToNewOrderBook={
            () => subscribeToMore({
              document: BID_ORDER_BOOK_SUBSCRIPTION,
              variables: { symbol },
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                return subscriptionData.data.newBidOpenOrder
              }
            })
          }
        />
      : <div>Empty Bid Orderbook</div>) : (
        <div>No Bids</div>
      )}
      
    </Stack>
  );
};

export default OrderBook;
