import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Portfolio, Holding } from '../../types'
import { api } from '../../services/api'

interface HoldingsTableProps {
  portfolio: Portfolio
  trackedNames: string[]
}

// Mock holdings data
const MOCK_HOLDINGS: Holding[] = [
  { ticker: 'NVDA', company: 'NVIDIA Corporation', value: '$1M - $5M', sector: 'Technology', change_percent: 12.5 },
  { ticker: 'AAPL', company: 'Apple Inc.', value: '$500K - $1M', sector: 'Technology', change_percent: 3.2 },
  { ticker: 'MSFT', company: 'Microsoft Corporation', value: '$250K - $500K', sector: 'Technology', change_percent: -1.8 },
  { ticker: 'GOOGL', company: 'Alphabet Inc.', value: '$100K - $250K', sector: 'Technology', change_percent: 5.6 },
  { ticker: 'TSLA', company: 'Tesla, Inc.', value: '$50K - $100K', sector: 'Automotive', change_percent: -8.3 },
  { ticker: 'AMZN', company: 'Amazon.com Inc.', value: '$100K - $250K', sector: 'Consumer', change_percent: 2.1 },
]

export default function HoldingsTable({ portfolio, trackedNames }: HoldingsTableProps) {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Holding>('value')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchHoldings = async () => {
      if (trackedNames.length === 0) {
        setHoldings(MOCK_HOLDINGS)
        setLoading(false)
        return
      }

      try {
        const data = await api.getHoldings(trackedNames[0])
        setHoldings(data.length > 0 ? data : MOCK_HOLDINGS)
      } catch (error) {
        setHoldings(MOCK_HOLDINGS)
      } finally {
        setLoading(false)
      }
    }

    fetchHoldings()
  }, [trackedNames])

  const handleSort = (field: keyof Holding) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sortedHoldings = [...holdings].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const modifier = sortDir === 'asc' ? 1 : -1

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier
    }
    return String(aVal).localeCompare(String(bVal)) * modifier
  })

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading holdings...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-terminal-card">
          <tr className="text-left text-text-muted border-b border-terminal-border">
            <th
              className="pb-2 cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('ticker')}
            >
              Ticker
            </th>
            <th
              className="pb-2 cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('company')}
            >
              Company
            </th>
            <th
              className="pb-2 cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('value')}
            >
              Est. Value
            </th>
            <th
              className="pb-2 cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('sector')}
            >
              Sector
            </th>
            <th
              className="pb-2 text-right cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('change_percent')}
            >
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedHoldings.map((holding, i) => (
            <tr
              key={holding.ticker}
              className="border-b border-terminal-border/50 hover:bg-terminal-hover/50 transition-colors"
            >
              <td className="py-2">
                <span className="font-mono font-semibold text-accent-primary">
                  {holding.ticker}
                </span>
              </td>
              <td className="py-2 text-text-secondary truncate max-w-[150px]">
                {holding.company}
              </td>
              <td className="py-2 text-text-primary font-medium">
                {holding.value}
              </td>
              <td className="py-2">
                <span className="px-2 py-0.5 bg-terminal-border/50 rounded text-xs text-text-secondary">
                  {holding.sector}
                </span>
              </td>
              <td className="py-2 text-right">
                <span className={`flex items-center justify-end gap-1 font-medium
                  ${holding.change_percent >= 0 ? 'text-positive' : 'text-negative'}`}
                >
                  {holding.change_percent >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(holding.change_percent).toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {holdings.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No holdings data available
        </div>
      )}
    </div>
  )
}
