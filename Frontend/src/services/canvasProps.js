import { lastVisibleItemBasedZoomAnchor } from "react-financial-charts";
import { CHART_HEIGHT, CHART_MARGIN, CHART_WIDTH } from "../constants/chartConstants";
import scaleProvider from "./scaleProvider";

export const makeCanvasProps = (data) => {

	const scaleProv = scaleProvider(data)
	// const min = scaleProv.xAccessor(scaleProv.data[Math.max(0, scaleProv.data.length - 30)])
	// const max = scaleProv.xAccessor(scaleProv.data[scaleProv.data.length - 1]) + 5

	return ({
		height: CHART_HEIGHT,
		width: CHART_WIDTH,
		ratio: 3,
		margin: CHART_MARGIN,
		seriesName: 'data',
		// xExtents: [min, max + 5],
		zoomAnchor: lastVisibleItemBasedZoomAnchor,
		pointsPerPxThreshold: 0.5,
		...scaleProv
	})
}