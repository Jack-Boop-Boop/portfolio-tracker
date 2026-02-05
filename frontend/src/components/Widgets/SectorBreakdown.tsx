import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Portfolio, SectorData } from '../../types'

interface SectorBreakdownProps {
  portfolio: Portfolio
  trackedNames: string[]
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: '#00d4aa',
  Healthcare: '#00b894',
  Financial: '#0984e3',
  Energy: '#fdcb6e',
  Consumer: '#e17055',
  Industrial: '#6c5ce7',
  Materials: '#00cec9',
  Utilities: '#fab1a0',
  'Real Estate': '#74b9ff',
  Other: '#636e72',
}

// Mock sector data
const MOCK_SECTORS: SectorData[] = [
  { name: 'Technology', value: 45, color: SECTOR_COLORS.Technology },
  { name: 'Healthcare', value: 18, color: SECTOR_COLORS.Healthcare },
  { name: 'Financial', value: 15, color: SECTOR_COLORS.Financial },
  { name: 'Energy', value: 10, color: SECTOR_COLORS.Energy },
  { name: 'Consumer', value: 8, color: SECTOR_COLORS.Consumer },
  { name: 'Other', value: 4, color: SECTOR_COLORS.Other },
]

export default function SectorBreakdown({ portfolio, trackedNames }: SectorBreakdownProps) {
  const [sectors, setSectors] = useState<SectorData[]>(MOCK_SECTORS)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-terminal-card border border-terminal-border rounded-lg p-2 shadow-lg">
          <p className="text-text-primary font-medium">{data.name}</p>
          <p className="text-accent-primary">{data.value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {sectors.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  stroke="transparent"
                  style={{ transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        {sectors.map((sector, index) => (
          <div
            key={sector.name}
            className={`flex items-center gap-2 py-1 px-2 rounded transition-colors cursor-default
              ${activeIndex === index ? 'bg-terminal-hover' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: sector.color }}
            />
            <span className="text-xs text-text-secondary truncate flex-1">
              {sector.name}
            </span>
            <span className="text-xs font-medium text-text-primary">
              {sector.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
