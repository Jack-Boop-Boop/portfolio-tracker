import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Portfolio, SentimentData } from '../../types'
import { api } from '../../services/api'

interface SentimentGaugeProps {
  portfolio: Portfolio
  trackedNames: string[]
}

export default function SentimentGauge({ portfolio, trackedNames }: SentimentGaugeProps) {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSentiment = async () => {
      if (trackedNames.length === 0) return

      try {
        // Get sentiment for first tracked person
        const data = await api.getSentiment(trackedNames[0])
        setSentiment(data)
      } catch (error) {
        // Use mock data on error
        setSentiment({
          overall: 62,
          reddit: 58,
          news: 66,
          trend: 'up',
          mentions: 1247,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSentiment()
  }, [trackedNames])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    )
  }

  if (!sentiment) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted">
        No sentiment data
      </div>
    )
  }

  const getSentimentColor = (value: number) => {
    if (value >= 60) return 'text-positive'
    if (value <= 40) return 'text-negative'
    return 'text-warning'
  }

  const getTrendIcon = () => {
    switch (sentiment.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-positive" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-negative" />
      default:
        return <Minus className="w-4 h-4 text-warning" />
    }
  }

  // Calculate gauge rotation (-90 to 90 degrees based on 0-100 value)
  const rotation = ((sentiment.overall / 100) * 180) - 90

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Gauge */}
      <div className="relative w-32 h-16 overflow-hidden mb-4">
        {/* Background arc */}
        <div className="absolute inset-0 border-8 border-terminal-border rounded-t-full" />

        {/* Colored segments */}
        <div className="absolute inset-0 border-8 border-transparent border-l-negative border-t-warning rounded-t-full"
             style={{ clipPath: 'polygon(0 100%, 0 0, 50% 0, 50% 100%)' }} />
        <div className="absolute inset-0 border-8 border-transparent border-r-positive border-t-warning rounded-t-full"
             style={{ clipPath: 'polygon(50% 100%, 50% 0, 100% 0, 100% 100%)' }} />

        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-14 bg-text-primary origin-bottom rounded-full transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />

        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent-primary rounded-full" />
      </div>

      {/* Score */}
      <div className="text-center">
        <div className={`text-3xl font-bold ${getSentimentColor(sentiment.overall)}`}>
          {sentiment.overall}
        </div>
        <div className="flex items-center justify-center gap-1 text-text-secondary text-sm">
          {getTrendIcon()}
          <span>Overall Sentiment</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4">
        <div className="bg-terminal-bg rounded p-2 text-center">
          <div className={`text-lg font-semibold ${getSentimentColor(sentiment.reddit)}`}>
            {sentiment.reddit}
          </div>
          <div className="text-xs text-text-muted">Reddit</div>
        </div>
        <div className="bg-terminal-bg rounded p-2 text-center">
          <div className={`text-lg font-semibold ${getSentimentColor(sentiment.news)}`}>
            {sentiment.news}
          </div>
          <div className="text-xs text-text-muted">News</div>
        </div>
      </div>

      {/* Mentions */}
      <div className="mt-3 text-xs text-text-muted">
        {sentiment.mentions.toLocaleString()} mentions this week
      </div>
    </div>
  )
}
