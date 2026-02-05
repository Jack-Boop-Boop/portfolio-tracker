import { useState, useEffect } from 'react'
import { User, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react'
import { Portfolio, TrackedPerson } from '../../types'

interface WatchlistProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Mock performance data
const MOCK_PERFORMANCE: Record<string, { return: number; trades: number }> = {
  'Nancy Pelosi': { return: 42.5, trades: 23 },
  'Dan Crenshaw': { return: 18.2, trades: 15 },
  'Warren Buffett': { return: 28.7, trades: 8 },
  'Ray Dalio': { return: 12.4, trades: 12 },
  'Tommy Tuberville': { return: -5.3, trades: 31 },
}

const DEFAULT_PEOPLE = [
  { id: 1, portfolio_id: 0, name: 'Nancy Pelosi', type: 'politician' as const, image_url: undefined as string | undefined },
  { id: 2, portfolio_id: 0, name: 'Dan Crenshaw', type: 'politician' as const, image_url: undefined as string | undefined },
  { id: 3, portfolio_id: 0, name: 'Warren Buffett', type: 'hedge_fund' as const, image_url: undefined as string | undefined },
]

export default function Watchlist({ portfolio, trackedNames }: WatchlistProps) {
  const people = portfolio.people.length > 0 ? portfolio.people : DEFAULT_PEOPLE

  const getPerformance = (name: string) => {
    return MOCK_PERFORMANCE[name] || { return: Math.random() * 40 - 10, trades: Math.floor(Math.random() * 30) }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getTypeColor = (type: string) => {
    return type === 'politician' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
  }

  return (
    <div className="h-full overflow-auto space-y-2">
      {people.map((person) => {
        const perf = getPerformance(person.name)
        const isPositive = perf.return >= 0

        return (
          <div
            key={person.id}
            className="p-3 bg-terminal-bg rounded-lg hover:bg-terminal-hover
                     transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-terminal-border flex items-center justify-center
                            text-text-secondary font-medium text-sm">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={person.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(person.name)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary truncate">
                    {person.name}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeColor(person.type)}`}>
                    {person.type === 'politician' ? 'POL' : 'HF'}
                  </span>
                </div>
                <div className="text-xs text-text-muted">
                  {perf.trades} trades this year
                </div>
              </div>

              {/* Performance */}
              <div className="text-right">
                <div className={`flex items-center gap-1 font-medium
                  ${isPositive ? 'text-positive' : 'text-negative'}`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {isPositive ? '+' : ''}{perf.return.toFixed(1)}%
                </div>
                <div className="text-xs text-text-muted">YTD</div>
              </div>

              {/* Menu */}
              <button className="p-1 opacity-0 group-hover:opacity-100 hover:bg-terminal-border
                               rounded transition-all">
                <MoreHorizontal className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>
        )
      })}

      {people.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No one being tracked</p>
        </div>
      )}
    </div>
  )
}
