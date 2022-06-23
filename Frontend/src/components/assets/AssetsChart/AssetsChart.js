import { Card, Stack, Title } from "@mantine/core";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend } from 'chart.js';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend )

export default function AssetsChart() {

	const today = new Date()
	const dates = [...Array(7).keys()].reverse().map(d => {
		const date = new Date(new Date().setDate(today.getDate() - d))
		return `${date.getDate()}/${date.getMonth()}`
	})

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			}
		},
	}

	const data = {
		labels: dates,
		datasets: [
			{
				label: 'Balance',
				data: dates.map(() => 100),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			}
		]
	}

	console.log(data)

	return (
		<Card withBorder>
			<Stack>
				<Title order={5}>This Week</Title>
				<Line options={options} data={data}/>
			</Stack>
		</Card>
	)
}