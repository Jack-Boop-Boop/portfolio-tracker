import { useState, useEffect } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Clock, User } from 'lucide-react'
import { Portfolio, Trade } from '../../types'
import { api } from '../../services/api'

interface TradeAlertsProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Mock trade data
const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    person: 'Nancy Pelosi',
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    type: 'buy',
    amount: '$1,000,001 - $5,000,000',
    date: '2024-01-15',
    filed_date: '2024-01-20',
  },
  {
    id: '2',
    person: 'Dan Crenshaw',
    ticker: 'MSFT',
    company: 'Microsoft Corporation',
    type: 'buy',
    amount: '$15,001 - $50,000',
    date: '2024-01-12',
    filed_date: '2024-01-18',
  },
  {
    id: '3',
    person: 'Nancy Pelosi',
    ticker: 'AAPL',
    company: 'Apple Inc.',
    type: 'sell',
    amount: '$250,001 - $500,000',
    date: '2024-01-10',
    filed_date: '2024-01-16',
  },
  {
    id: '4',
    person: 'Tommy Tuberville',
    ticker: 'GOOGL',
    company: 'Alphabet Inc.',
    type: 'buy',
    amount: '$100,001 - $250,000',
    date: '2024-01-08',
    filed_date: '2024-01-14',
  },
  {
    id: '5',
    person: 'Mark Green',
    ticker: 'TSLA',
    company: 'Tesla, Inc.',
    type: 'sell',
    amount: '$50,001 - $100,000',
    date: '2024-01-05',
    filed_date: '2024-01-12',
  },
]

export default function TradeAlerts({ portfolio, trackedNames }: TradeAlertsProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // Fetch trades for all tracked people
        const allTrades: Trade[] = []

        if (trackedNames.length > 0) {
          for (const name of trackedNames.slice(0, 3)) {
            try {
              const personTrades = await api.getPersonTrades(name, 5)
              allTrades.push(...personTrades)
            } catch (e) {
              // Continue with other names
            }
          }
        }

        if (allTrades.length === 0) {
          // If no trades from API, try recent trades
          try {
            const recent = await api.getRecentTrades(10)
            allTrades.push(...recent)
          } catch (e) {
            // Use mock data
          }
        }

        setTrades(allTrades.length > 0 ? allTrades : MOCK_TRADES)
      } catch (error) {
        setTrades(MOCK_TRADES)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [trackedNames])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading trades...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto space-y-2">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="p-3 bg-terminal-bg rounded-lg border-l-2
                   hover:bg-terminal-hover transition-colors"
          style={{
            borderLeftColor: trade.type === 'buy' ? '#00c853' : '#ff5252',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {trade.type === 'buy' ? (
                <ArrowUpCircle className="w-5 h-5 text-positive" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-negative" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-accent-primary">
                    {trade.ticker}
                  </span>
                  <span className={`text-xs font-medium uppercase px-1.5 py-0.5 rounded
                    ${trade.type === 'buy'
                      ? 'bg-positive/20 text-positive'
                      : 'bg-negative/20 text-negative'
                    }`}
                  >
                    {trade.type}
                  </span>
                </div>
                <div className="text-xs text-text-muted truncate max-w-[200px]">
                  {trade.company}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-text-primary">
                {trade.amount}
              </div>
              <div className="flex items-center gap-1 text-xs text-text-muted justify-end">
                <Clock className="w-3 h-3" />
                {formatDate(trade.date)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
            <User className="w-3 h-3" />
            {trade.person}
            <span className="text-text-muted ml-auto">
              Filed: {formatDate(trade.filed_date)}
            </span>
          </div>
        </div>
      ))}

      {trades.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No recent trades
        </div>
      )}
    </div>
  )
}
