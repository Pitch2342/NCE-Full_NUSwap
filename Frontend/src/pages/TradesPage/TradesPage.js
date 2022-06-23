import { SimpleGrid, Stack, Title } from "@mantine/core";
import SymbolCard from "../../components/trades/SymbolCard/SymbolCard";
import { SYMBOLS } from "../../constants/symbols";

export default function TradesPage() {
	return (
		<Stack p={24} spacing={48}>
			<Stack>
				<Title order={2}>Symbols</Title>
				<SimpleGrid cols={4}>
					{SYMBOLS.map(s => <SymbolCard key={s.name} symbol={s}/>)}
				</SimpleGrid>
			</Stack>
		</Stack>
	)
}