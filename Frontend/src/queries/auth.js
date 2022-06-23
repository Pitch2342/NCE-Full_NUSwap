import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			status
			response
			error
		}
	}
`

export const REGISTER_MUTATION = gql`
	mutation CreateUser($name: String!, $email: String!, $password: String!) {
		createUser(name: $name, email: $email, password: $password) {
			status
			response
			error
		}
	}
`

export const CURRENT_USER = gql`
	query CurrentUser {
		currentUser {
			userid
			name
			email
			phone
			balance
		}
	}
`