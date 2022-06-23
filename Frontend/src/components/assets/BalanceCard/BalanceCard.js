import { Button, Card, Divider, NumberInput, Space, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { CurrencyDollar } from "tabler-icons-react";
import { GET_USER_BALANCE, ADD_BALANCE_MUTATION } from '../../../queries/OrdersAndWallets'
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client'
import { showNotification } from "@mantine/notifications"


export default function BalanceCard({userid}) {

	const [userBalance, setUserBalance] = useState([])
	const { loading: queryloading, error: queryError, data: queryData } = useQuery(GET_USER_BALANCE, 
		{variables: {userid}}
	);
  
	const form = useForm({
		initialValues: { amount: 0.00 }
	})

	const [startAddBalance] = useMutation(ADD_BALANCE_MUTATION, {
		variables: {
			userid: userid,
			amount: form.values.amount
		},
		onCompleted: ({ addBalance }) => {
			// console.log(addBalance.error)
			if (addBalance.response) {
				console.log("ADDED BALANCE ",addBalance)
				window.location.reload()
			} else {
				showNotification({
					title: 'Balance Add Failed',
					message: addBalance.error
				})
			}
		}
	})

	useEffect(() => {
		try {
			if (queryData !== undefined && queryData.getUserBalance) {
				const res = queryData.getUserBalance
				setUserBalance(res)
			}
		} catch (error) {}
	}, [userid, queryloading, queryError, queryData])

	// console.log(userBalance)
	// console.log(userid)
	// console.log("HERE XXXXXXXXXXXXXXXXXXXX")

	return (
		<Card withBorder>
			<Stack spacing={6}>
				<Title order={5}>Balance</Title>
				<Text size='xl'>${userBalance}</Text>
				{/* <Text>{userid}</Text> */}
				<Space/>
				<Text size="xs">As of 4 June 2022</Text>
			</Stack>
			<Divider my='md' size='xs' mx='sm'/>
			<Stack spacing={6}>
				<Title order={5}>Top Up</Title>
				<NumberInput label="Amount" defaultValue={0.05} precision={2} min={0.01} step={0.05} max={100000} icon={<CurrencyDollar size={18}/>} {...form.getInputProps('amount')}/>
				<Space/>
				{/* <Button variant='filled' size="sm" onClick={() => window.location.reload()} disabled={form.values.amount === 0}>Top Up</Button> */}
				<Button variant='filled' size="sm" onClick={() => startAddBalance()} disabled={form.values.amount === 0}>Top Up</Button>
			</Stack>
		</Card>
	)
}