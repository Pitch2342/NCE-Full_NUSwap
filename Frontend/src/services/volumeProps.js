import { CHART_HEIGHT, CHART_MARGIN } from "../constants/chartConstants"
import { colors } from "../constants/colors"

export const volumeChartProps = {
	id: 2,
	height: (CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom) / 4,
	origin: (_, h) => [0, h - ((CHART_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom) / 4)],
	yExtents: d => d.vol
}

export const volumeSeriesProps = {
	fillStyle: d => d.close > d.open ? colors.green(0.4) : colors.red(0.4),
	yAccessor: d => d.vol
}