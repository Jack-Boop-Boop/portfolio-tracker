import { useState, useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi } from 'lightweight-charts'
import { Portfolio, ChartDataPoint } from '../../types'
import { api } from '../../services/api'

interface PriceChartProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Generate mock chart data
const generateMockData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  let basePrice = 150
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    const change = (Math.random() - 0.5) * 10
    basePrice += change
    const open = basePrice
    const close = basePrice + (Math.random() - 0.5) * 5
    const high = Math.max(open, close) + Math.random() * 3
    const low = Math.min(open, close) - Math.random() * 3

    data.push({
      time: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 10000000),
    })
  }

  return data
}

export default function PriceChart({ portfolio, trackedNames }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [selectedTicker, setSelectedTicker] = useState('NVDA')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ChartDataPoint[]>([])

  const tickers = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'TSLA']

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const chartData = await api.getStockData(selectedTicker, '1mo')
        setData(chartData.length > 0 ? chartData : generateMockData())
      } catch (error) {
        setData(generateMockData())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedTicker])

  useEffect(() => {
    if (!chartContainerRef.current || loading || data.length === 0) return

    // Clear previous chart
    if (chartRef.current) {
      chartRef.current.remove()
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#8b98a5',
      },
      grid: {
        vertLines: { color: '#1a2332' },
        horzLines: { color: '#1a2332' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      crosshair: {
        vertLine: {
          color: '#00d4aa',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#00d4aa',
          width: 1,
          style: 2,
        },
      },
      timeScale: {
        borderColor: '#2d3748',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#2d3748',
      },
    })

    chartRef.current = chart

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00c853',
      downColor: '#ff5252',
      borderUpColor: '#00c853',
      borderDownColor: '#ff5252',
      wickUpColor: '#00c853',
      wickDownColor: '#ff5252',
    })

    candlestickSeries.setData(
      data.map(d => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    )

    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [data, loading])

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0
  const previousPrice = data.length > 1 ? data[data.length - 2].close : currentPrice
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="bg-terminal-bg border border-terminal-border rounded px-2 py-1
                     text-text-primary text-sm focus:outline-none focus:border-accent-primary"
          >
            {tickers.map((ticker) => (
              <option key={ticker} value={ticker}>
                {ticker}
              </option>
            ))}
          </select>

          <div>
            <span className="text-lg font-bold text-text-primary">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`ml-2 text-sm font-medium
              ${priceChange >= 0 ? 'text-positive' : 'text-negative'}`}
            >
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
              ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
            <button
              key={period}
              className="px-2 py-1 text-xs text-text-muted hover:text-text-primary
                       hover:bg-terminal-hover rounded transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="flex-1 min-h-0">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-text-muted">Loading chart...</div>
          </div>
        )}
      </div>
    </div>
  )
}
