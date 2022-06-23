import { ActionIcon, Group, Header, Text, Title } from "@mantine/core"
import { Logout, UserCircle } from "tabler-icons-react"

export default function NCEHeader({user, logout}) {
	return (
		<Header height={60} p='xs'>
			<Group position='apart'>
				<Title order={2}>NUSwap</Title>
				<Group>
					<Text>
						{user.name}
					</Text>
					<ActionIcon variant='light'>
						<UserCircle/>
					</ActionIcon>
					<ActionIcon onClick={logout} color='red' variant='light'>
						<Logout/>
					</ActionIcon>
				</Group>
			</Group>
		</Header>
	)
}