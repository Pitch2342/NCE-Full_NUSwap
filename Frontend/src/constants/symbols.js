import Bitcoin from 'cryptocurrency-icons/svg/color/btc.svg'
import Ripple from 'cryptocurrency-icons/svg/color/xrp.svg'
import Ethereum from 'cryptocurrency-icons/svg/color/eth.svg'
import { Image } from "@mantine/core";

export const SYMBOLS = [
	{
		name: 'Bitcoin',
		symbol: 'BTC',
		code: 'btcusd',
		icon: <Image src={Bitcoin} width={32}/>
	},
	{
		name: 'Ethereum',
		symbol: 'ETH',
		code: 'ethusd',
		icon: <Image src={Ethereum} width={32}/>
	},
	{
		name: 'Ripple',
		symbol: 'XRP',
		code: 'xrpusd',
		icon: <Image src={Ripple} width={32}/>
	},
]