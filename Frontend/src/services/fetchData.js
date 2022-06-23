const fetchData = (symbol, interval, callback) => {
	fetch(`https://www.bitstamp.net/api/v2/ohlc/${symbol}?step=${interval}&limit=250`)
	.then(response => response.json())
	.then(dat => { try { return dat.data.ohlc } catch { return [] } })
	.then(dat => dat.map(x => ({
		date: new Date(parseInt(x.timestamp) * 1000),
		open: parseFloat(x.open),
		high: parseFloat(x.high),
		low: parseFloat(x.low),
		close: parseFloat(x.close),
		vol: parseFloat(x.volume)
	})))
	.then(callback)
}

export default fetchData