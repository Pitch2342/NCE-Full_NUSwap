import { useQuery} from '@apollo/client'
import { Stack} from "@mantine/core";
import React, { useState, useEffect } from "react";
import { CLOSED_ORDER_USER_QUERY, OPEN_ASK_ORDER_USER_QUERY, OPEN_BID_ORDER_USER_QUERY } from '../../../queries/OrdersAndWallets'
import TableGenerator from '../TableGenerator/TableGenerator'

const UserOrdersComponent = ({symbol, owner}) => {
  const [closedOrders, setClosedOrders] = useState([])
  const { loading: closeQueryloading, error: closeQueryError, data: closeQueryData } = useQuery(CLOSED_ORDER_USER_QUERY, {variables: {symbol, owner}}
  );

  useEffect(() => {
		try {
			if (closeQueryData !== undefined && closeQueryData.getClosedOrdersForSymbolAndUser) {
        const res = closeQueryData.getClosedOrdersForSymbolAndUser
        const R1 = res.map(d => ({...d, createdat: new Date(parseInt(d.createdat)).toLocaleString("en-US")}))
        const R2 = R1.map(d => ({...d, filledat: new Date(parseInt(d.filledat)).toLocaleString("en-US")}))
        const R3 = R2.map(obj => {
          if (obj.buyside === '1') {
            return {...obj, action: 'BUY'};
          }
          else {
            return {...obj, action: 'SELL'};
          }
        });
        const R4 = R3.map(({orderid,action,quantity,price,fillprice,createdat,filledat, ...del_attrs}) => ({orderid,action,quantity,price,fillprice,createdat,filledat}))
				const R5 = R4.map( item => {
          const { fillprice: fill_price, createdat: created_at, filledat: filled_at, ...rest } = item;
          return { ...rest, fill_price, created_at, filled_at }
         }
        );
        // console.log("CLOSED ORDERS R5",R5)
        setClosedOrders(R5)
			}
		} catch (error) {}
	}, [symbol, closeQueryloading, closeQueryError, closeQueryData])

  const [openAskOrders, setOpenAskOrders] = useState([])
  const { loading: openAskQueryloading, error: openAskQueryError, data: openAskQueryData } = useQuery(OPEN_ASK_ORDER_USER_QUERY, {variables: {symbol, owner}}
  );

  useEffect(() => {
		try {
			if (openAskQueryData !== undefined && openAskQueryData.getOpenAskOrdersForSymbolAndUser) {
				const res = openAskQueryData.getOpenAskOrdersForSymbolAndUser
        const R1 = res.map(d => ({...d, createdat: new Date(parseInt(d.createdat)).toLocaleString("en-US")}))
        const R2 = R1.map(d => ({...d, updatedat: new Date(parseInt(d.updatedat)).toLocaleString("en-US")}))
        const R3 = R2.map(({orderid,quantity,price,openquantity,fillcost,createdat,updatedat, ...del_attrs}) => ({orderid,quantity,price,openquantity,fillcost,createdat,updatedat}))
        const R4 = R3.map( item => {
          const { openquantity: open_quantity, fillcost: fill_cost, createdat: created_at, updatedat: updated_at, ...rest } = item;
          return { ...rest, open_quantity,fill_cost, created_at, updated_at }
         }
        );
        // console.log("OPEN ASK R4",R4)
        setOpenAskOrders(R4)
			}
		} catch (error) {}
	}, [symbol, openAskQueryloading, openAskQueryError, openAskQueryData])

  const [openBidOrders, setOpenBidOrders] = useState([])
  const { loading: openBidQueryloading, error: openBidQueryError, data: openBidQueryData } = useQuery(OPEN_BID_ORDER_USER_QUERY, {variables: {symbol, owner}}
  );

  useEffect(() => {
		try {
			if (openBidQueryData !== undefined && openBidQueryData.getOpenBidOrdersForSymbolAndUser) {
				const res = openBidQueryData.getOpenBidOrdersForSymbolAndUser
        const R1 = res.map(d => ({...d, createdat: new Date(parseInt(d.createdat)).toLocaleString("en-US")}))
        const R2 = R1.map(d => ({...d, updatedat: new Date(parseInt(d.updatedat)).toLocaleString("en-US")}))
        const R3 = R2.map(({orderid,quantity,price,openquantity,fillcost,createdat,updatedat, ...del_attrs}) => ({orderid,quantity,price,openquantity,fillcost,createdat,updatedat}))
        const R4 = R3.map( item => {
          const { openquantity: open_quantity, fillcost: fill_cost, createdat: created_at, updatedat: updated_at, ...rest } = item;
          return { ...rest, open_quantity,fill_cost, created_at, updated_at }
         }
        );
        // console.log("OPEN BID R4",R4)
        setOpenBidOrders(R4)
			}
		} catch (error) {}
	}, [symbol, openBidQueryloading, openBidQueryError, openBidQueryData])

  // console.log(closedOrders.length, openAskOrders.length, openBidOrders.length)

  
  return (
      <div>
      <Stack>
        {closedOrders.length > 0 &&
          <TableGenerator DataObject = {closedOrders} title = {"CLOSED ORDERS"}/>
        }
        {openAskOrders.length > 0 &&
          <TableGenerator DataObject = {openAskOrders} title = {"OPEN ASK ORDERS"}/>
        }
        {openBidOrders.length > 0 &&
          <TableGenerator DataObject = {openBidOrders} title = {"OPEN BID ORDERS"}/>
        }
      </Stack>
      </div>
    )

};

export default UserOrdersComponent;
