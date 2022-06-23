import { useQuery, useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'
import { BarSeries, CandlestickSeries, Chart, ChartCanvas, CrossHairCursor, EdgeIndicator, LineSeries, MouseCoordinateY, OHLCTooltip, XAxis, YAxis } from 'react-financial-charts'
import { MARKET_HISTORY_QUERY } from '../../../queries/market-history'
import { NEW_ORDER_FILLED_SUBSCRIPTION } from '../../../queries/order-fillings'
import { makeCanvasProps } from '../../../services/canvasProps'
import { finchartOnMessage } from '../../../services/createWebSocket'
import { axisStyles, candleSeriesProps, lineSeriesProps, mainChartProps } from '../../../services/mainChartProps'
import { edgeIndicatorProps, mouseCoordinateYProps } from '../../../services/miscProps'
import { volumeChartProps, volumeSeriesProps } from '../../../services/volumeProps'

const ChartBody = ({symbol, interval, type}) => {
	
	const [finchartData, setFinchartData] = useState([])

	const { loading: queryloading, error: queryError, data: queryData } = useQuery(MARKET_HISTORY_QUERY, {
		variables: { symbol }
	})

	const { loading: subscriptionloading, error: subscriptionError, data: subscriptionData } = useSubscription(NEW_ORDER_FILLED_SUBSCRIPTION, {
		variables: { symbol }
	})
	
	useEffect(() => {
		try {
			if (queryData !== undefined && queryData.getMarketHistoryForSymbol) {
				const res = queryData.getMarketHistoryForSymbol.map(d => ({...d, time: new Date(parseInt(d.time))}))
				setFinchartData(res)
			}
		} catch (error) {}
		// return createWebSocket(`live_trades_${symbol}`, finchartOnMessage(interval, setFinchartData))
	}, [interval, symbol, queryloading, queryError, queryData])

	useEffect(() => {
		if (subscriptionData !== undefined && subscriptionData.newOrderFilled.price) finchartOnMessage(subscriptionData.newOrderFilled, interval, setFinchartData)
	}, [interval, symbol, subscriptionloading, subscriptionError, subscriptionData])
	
	return (
		<ChartCanvas {...makeCanvasProps(finchartData)}>
			<Chart {...volumeChartProps}>
				<BarSeries {...volumeSeriesProps}/>
			</Chart>
			<Chart {...mainChartProps}>
				<XAxis {...axisStyles}/>
				<YAxis {...axisStyles}/>
				{ type === 'Line' ? <LineSeries {...lineSeriesProps}/> : <CandlestickSeries {...candleSeriesProps}/> }
				<MouseCoordinateY {...mouseCoordinateYProps}/>
				<EdgeIndicator {...edgeIndicatorProps}/>
				<OHLCTooltip origin={[24, 24]}/>
			</Chart>
			<CrossHairCursor/>
		</ChartCanvas>
		)
	}
	
	export default ChartBody