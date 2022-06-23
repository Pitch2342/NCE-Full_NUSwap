import { Navbar, Stack } from "@mantine/core"
import { ChartLine, ListDetails, News } from "tabler-icons-react"
import NCENavbarLink from "../NCENavbarLink/NCENavbarLink"

export default function NCENavbar() {
	return (
		<Navbar width={{ base: 220 }} height={500} p='xs'>
			<Stack spacing={4}>
				<NCENavbarLink title={"Trades"} icon={<ChartLine/>} color='blue' url='/'/>
				<NCENavbarLink title={"Your Assets"} icon={<ListDetails/>} color='orange' url='/assets'/>
				<NCENavbarLink title={"NUSwap Blog"} icon={<News/>} color='green' url='/blog'/>
			</Stack>
			
		</Navbar>
	)
}