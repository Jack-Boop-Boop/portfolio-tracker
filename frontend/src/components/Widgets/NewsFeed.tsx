import { useState, useEffect } from 'react'
import { ExternalLink, Clock } from 'lucide-react'
import { Portfolio, NewsItem } from '../../types'
import { api } from '../../services/api'

interface NewsFeedProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Mock news data
const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Congress Members Make Major Tech Stock Moves Ahead of Earnings',
    source: 'Financial Times',
    url: '#',
    published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sentiment: 'positive',
    related_tickers: ['NVDA', 'AAPL', 'MSFT'],
  },
  {
    id: '2',
    title: 'New Disclosure Rules May Impact Congressional Trading',
    source: 'Bloomberg',
    url: '#',
    published_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    sentiment: 'neutral',
    related_tickers: [],
  },
  {
    id: '3',
    title: 'Hedge Fund Managers Increase Positions in AI Sector',
    source: 'Reuters',
    url: '#',
    published_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    sentiment: 'positive',
    related_tickers: ['NVDA', 'AMD', 'GOOGL'],
  },
  {
    id: '4',
    title: 'Market Volatility Prompts Portfolio Adjustments',
    source: 'WSJ',
    url: '#',
    published_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    sentiment: 'negative',
    related_tickers: ['SPY', 'QQQ'],
  },
]

export default function NewsFeed({ portfolio, trackedNames }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      if (trackedNames.length === 0) {
        setNews(MOCK_NEWS)
        setLoading(false)
        return
      }

      try {
        const data = await api.getNews(trackedNames[0], 10)
        setNews(data.length > 0 ? data : MOCK_NEWS)
      } catch (error) {
        setNews(MOCK_NEWS)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [trackedNames])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-positive/20 text-positive'
      case 'negative':
        return 'bg-negative/20 text-negative'
      default:
        return 'bg-terminal-border text-text-muted'
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading news...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto space-y-3">
      {news.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-terminal-bg rounded-lg hover:bg-terminal-hover
                   transition-colors group"
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm text-text-primary group-hover:text-accent-primary
                         transition-colors line-clamp-2">
              {item.title}
            </h4>
            <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0 opacity-0
                                   group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text-muted">{item.source}</span>
            <span className="text-text-muted">·</span>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              {formatTime(item.published_at)}
            </span>
            <span className={`ml-auto px-1.5 py-0.5 rounded text-xs ${getSentimentColor(item.sentiment)}`}>
              {item.sentiment}
            </span>
          </div>

          {item.related_tickers && item.related_tickers.length > 0 && (
            <div className="flex gap-1 mt-2">
              {item.related_tickers.map((ticker) => (
                <span
                  key={ticker}
                  className="px-1.5 py-0.5 bg-accent-primary/10 text-accent-primary
                           rounded text-xs font-mono"
                >
                  ${ticker}
                </span>
              ))}
            </div>
          )}
        </a>
      ))}

      {news.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No news available
        </div>
      )}
    </div>
  )
}
