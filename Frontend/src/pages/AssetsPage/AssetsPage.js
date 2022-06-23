import { Grid, Stack, Title } from "@mantine/core";
// import AssetsChart from "../../components/assets/AssetsChart/AssetsChart";
import AssetsTable from "../../components/assets/AssetsTable/AssetsTable";
import BalanceCard from "../../components/assets/BalanceCard/BalanceCard";


export default function AssetsPage({props}) {

	return (
		<Stack p={24}>
			<Title order={2}>Your Assets</Title>
			<Grid columns={24}>
				<Grid.Col span={16}>
					<Grid columns={24}>
						{/* <Grid.Col md={24}>
							<AssetsChart/>
						</Grid.Col> */}
						<Grid.Col md={24}>
							<AssetsTable walletid={props.user.userid}/>
						</Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col span={8}>
				{<BalanceCard userid={props.user.userid}/>}
				</Grid.Col>
			</Grid>
		</Stack>
	)
}