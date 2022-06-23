import { AppShell } from "@mantine/core"
import NCEHeader from "../NCEHeader/NCEHeader"
import NCENavbar from "../NCENavbar/NCENavbar"

 export default function AppContainer({user, logout, children}) {
	return (
		<AppShell padding='md' navbar={<NCENavbar/>} header={<NCEHeader user={user} logout={logout}/>}>
			{children}
		</AppShell>
	)
}