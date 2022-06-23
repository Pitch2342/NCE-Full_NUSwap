// import { Card, Stack, Table, Title } from "@mantine/core";
import { WALLET_ASSETS_USER_QUERY } from '../../../queries/OrdersAndWallets'
import React, { useState, useEffect } from "react";
import { useQuery} from '@apollo/client'
import AssetTableGenerator from "../AssetTableGenerator/AssetTableGenerator";

export default function AssetsTable({walletid}) {
	// console.log("ASSETS TABLE L8")
	// console.log("WID",walletid)
	const [walletAssets, setWalletAssets] = useState([])
	const { loading: queryloading, error: queryError, data: queryData } = useQuery(WALLET_ASSETS_USER_QUERY, 
		{variables: {walletid}}
	);
	// console.log("ASSETS TABLE L12")
	console.log("QD ",queryData)
	useEffect(() => {
		try {
			if (queryData !== undefined && queryData.getWalletAssetsWalletID) {
				const res = queryData.getWalletAssetsWalletID
				const R2 = res.map(({symbol,amount, ...del_attrs}) => ({symbol,amount}))
				// console.log(res)
				// console.log(R2)
				setWalletAssets(R2)
			}
		} catch (error) {}
	}, [walletid, queryloading, queryError, queryData])

	if(walletAssets.length) return (<AssetTableGenerator DataObject = {walletAssets} title = {"CURRENT ASSETS"}/>)
	else return (<div>NO ASSETS TO DISPLAY</div>)
	// return (
	// 	<div>
	// 	HI
	// 	{/* <TableGenerator DataObject = {walletAssets}/> */}
	// 	</div>
	// )
}