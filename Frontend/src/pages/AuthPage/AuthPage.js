import { Card, Center, Space, Stack, Title } from "@mantine/core";
import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";

export default function AuthPage() {
	const [isLoginMode, setIsLoginMode] = useState(true)
	return (
		<Center style={{height:'100vh'}}>
			<Card withBorder p='xl' style={{width:'90%', maxWidth: 600}} shadow='xl'>
				<Stack p='xl'>
					<Title align='center'>NUSwap</Title>
					<Space/>
					{ isLoginMode ? <LoginForm setIsLoginMode={setIsLoginMode}/> : <RegisterForm setIsLoginMode={setIsLoginMode}/> }
				</Stack>
			</Card>
		</Center>
	)
}