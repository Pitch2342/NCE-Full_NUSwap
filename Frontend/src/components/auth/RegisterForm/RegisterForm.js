import { useMutation } from "@apollo/client"
import { Anchor, Button, PasswordInput, Space, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { AUTH_TOKEN } from "../../../constants/authToken"
import { REGISTER_MUTATION } from "../../../queries/auth"

export default function RegisterForm({ setIsLoginMode }) {

	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			password: ''
		}
	})

	const [startRegister] = useMutation(REGISTER_MUTATION, {
		variables: {
			name: form.values.name,
			email: form.values.email,
			password: form.values.password
		},
		onCompleted: ({ createUser }) => {
			console.log(createUser.error)
			if (createUser.response) {
				localStorage.setItem(AUTH_TOKEN, createUser.response)
				window.location.reload()
			} else {
				showNotification({
					title: 'Register Failed',
					message: createUser.error
				})
			}
		}
	})

	return (
		<>
			<TextInput placeholder="John Doe" label="Your Name" size="md" {...form.getInputProps('name')} />
			<TextInput placeholder="xxx.xxx@u.nus.edu" label="Your Email" size="md" {...form.getInputProps('email')} />
			<PasswordInput placeholder="Pasword" label="Password" size="md" {...form.getInputProps('password')} />
			<Space />
			<Button variant='filled' size="lg" onClick={() => startRegister()}>Register</Button>
			<Space />
			<Text align="center">Already have an account? <Anchor onClick={() => setIsLoginMode(true)}>Login</Anchor> </Text>
		</>
	)
}