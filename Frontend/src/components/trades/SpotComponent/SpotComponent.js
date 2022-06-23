import { useMutation } from "@apollo/client"
import { Button, NumberInput, Select, SimpleGrid, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import { CurrencyDollar, Hash } from "tabler-icons-react";
import { ADD_ORDER_MUTATION } from "../../../queries/order";

const modes = [
	{
		mode: 'Buy',
		component: <div>Buy</div>
	},
	{
		mode: 'Sell',
		component: <div>Sell</div>
	},
	{
		mode: 'Convert',
		component: <div>Convert</div>
	},
]

export default function SpotComponent(props) {

	const [mode, setMode] = useState(modes[0].mode)
	const form = useForm({
		initialValues: {
			orderType: 'Limit',
			price: 12,
			qty: 5
		}
	})
	// $symbol: String!, $type: String!, $side: String!, $quantity: Float!, $price: Float!, $ownerID: Int!, $walletID: Int!
	console.log(props.symbol, props.ownerId, props.walletId)
	const [placeOrder] = useMutation(ADD_ORDER_MUTATION, {
		variables: {
			symbol: props.symbol,
			type: form.values.orderType,
			side: mode,
			quantity: form.values.qty,
			price: form.values.price,
			ownerId: props.ownerId,
			walletId: props.walletId
		},
		onCompleted: ({ createOrder }) => {
			if (createOrder.response) {
				console.log(createOrder.response)
				window.location.reload()
			}
		}
	})


	return (
		<Stack>
			<Title order={3}>Spot</Title>
			<SimpleGrid cols={3}>
				{modes.map(m => <Button size="xs" onClick={() => setMode(m.mode)} variant={m.mode === mode ? 'filled' : 'light'}>{m.mode}</Button>)}
			</SimpleGrid>
			<Select value="" {...form.getInputProps('orderType')} data={['Limit', 'Market']} />
			{form.values.orderType === 'Limit' && <NumberInput label="Order Price" defaultValue={0.05} precision={2} min={0.01} step={0.05} max={1000000} icon={<CurrencyDollar size={18} />} {...form.getInputProps('price')} />}
			<NumberInput label="Quantity" defaultValue={0.05} precision={2} min={0.01} step={0.05} max={100} icon={<Hash size={18} />} {...form.getInputProps('qty')} />
			<Button size="md" onClick={() => { placeOrder().catch((error) => { console.log(JSON.stringify(error, null, 2)); }) }}>{mode} Now</Button>
		</Stack >
	)
}