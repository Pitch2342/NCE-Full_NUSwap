import { gql } from "apollo-server";
import { createModule } from "graphql-modules";

const HTTPResponseModule = createModule({
	id: 'http-response',
	typeDefs: gql`
		type HTTPResponse {
			status: Int!,
			response: String,
			error: String
		}
	`
})

export default HTTPResponseModule