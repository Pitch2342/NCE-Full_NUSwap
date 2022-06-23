import { gql } from "apollo-server";
import { createModule } from "graphql-modules";
import { readWallet } from "../db_functions/Wallet.js";

const WalletModule = createModule({
	id: 'wallet',
	typeDefs: gql`
		type Wallet {
			walletid: ID!
			owner: ID!
		}

		type Query {
			getAllWallets: [Wallet!]
			getCurrentUserWallets: [Wallet!]
			getWalletById(walletid: ID!): Wallet
		}
	`,
	resolvers: {
		Query: {
			getAllWallets: () => readWallet(false, {}),
			getCurrentUserWallets: (p, a, c) => readWallet(false, { owner: c.userid }),
			getWalletById: (p, a, c) => readWallet(true, a)
		}
	}
})

export default WalletModule