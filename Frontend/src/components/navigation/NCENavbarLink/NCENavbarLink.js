import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import './NCENavbarLink.css'

export default function NCENavbarLink({ title, url, icon, color }) {
	const navigate = useNavigate()
	return (
		<Box p={8} className='navbar-link' onClick={() => navigate(url)}>
			<Group>
				<ActionIcon variant="light" color={color}>
					{icon}
				</ActionIcon>
				<Text>
					{title}
				</Text>
			</Group>
		</Box>
	)
}