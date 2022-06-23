import { createApplication } from "graphql-modules";
import HTTPResponseModule from "../types/HTTPResponse.js";
import MarketHistoryModule from "../types/MarketHistory.js";
import OrderFillingModule from "../types/OrderFilling.js";
import UserModule from '../types/User.js'
import WalletModule from "../types/Wallet.js";
import WalletAssetModule from "../types/WalletAsset.js";
import ClosedOrderModule from "../types/ClosedOrder.js";
import OpenAskOrderModule from "../types/OpenAskOrder.js";
import OpenBidOrderModule from "../types/OpenBidOrder.js";
import OrderModule from "../types/Order.js";

const apolloApplication = createApplication({
	modules: [
		UserModule,
		HTTPResponseModule,
		WalletModule,
		WalletAssetModule,
		MarketHistoryModule,
		OrderFillingModule,
		ClosedOrderModule,
		OpenAskOrderModule,
		OpenBidOrderModule,
		OrderModule
	]
})

export default apolloApplication