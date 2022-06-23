import { CHART_MARGIN } from "../constants/chartConstants"
import { colors } from "../constants/colors"

export const edgeIndicatorProps = {
	itemType: 'last',
	rectWidth: CHART_MARGIN.right,
	fill: d => d.close > d.open ? colors.green(1) : colors.red(1),
	lineStroke: d => d.close > d.open ? colors.green(0.5) : colors.red(0.5),
	displayFormat: s => s.toFixed(2),
	yAccessor: d => d.close
}

export const mouseCoordinateYProps = {
	rectWidth: CHART_MARGIN.right,
	displayFormat: s => s.toFixed(2)
}