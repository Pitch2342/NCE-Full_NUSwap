import { Button, Card, Stack, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function SymbolCard({ symbol }) {
	const navigate = useNavigate()
	return (
		<Card withBorder p='lg'>
			<Stack align='center'>
				{symbol.icon}
				<Title order={3}>{symbol.name}</Title>
				<Button variant='light' onClick={() => navigate(`/trade/${symbol.code}`)}>Trade Now</Button>
			</Stack>
		</Card>
	)
}