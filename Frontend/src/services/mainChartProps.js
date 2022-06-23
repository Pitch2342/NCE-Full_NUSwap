import { CHART_HEIGHT, CHART_MARGIN } from "../constants/chartConstants"
import { colors } from "../constants/colors"

export const mainChartProps = {
	id: 3,
	height: CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom,
	yExtents: d => [d.high, d.low]
}

export const axisStyles = {
	strokeStyle: colors.dark(0.5),
	strokeWidth: 2,
	tickLabelFill: colors.gray(1),
	tickStrokeStyle: colors.gray(1),
	gridLinesStrokeStyle: colors.gray(0.2),
	showGridLines: true
}

export const candleSeriesProps = {
	fill: d => d.close > d.open ? colors.green(1) : colors.red(1)
}

export const lineSeriesProps = {
	yAccessor: d => d.close,
	strokeStyle: colors.blue(1),
	strokeWidth: 2
}