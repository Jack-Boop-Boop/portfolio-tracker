import { useState, useCallback } from 'react'
import GridLayout from 'react-grid-layout'
import { Portfolio, WidgetLayout } from '../../types'
import WidgetWrapper from '../Widgets/WidgetWrapper'
import SentimentGauge from '../Widgets/SentimentGauge'
import HoldingsTable from '../Widgets/HoldingsTable'
import NewsFeed from '../Widgets/NewsFeed'
import RedditFeed from '../Widgets/RedditFeed'
import PriceChart from '../Widgets/PriceChart'
import TradeAlerts from '../Widgets/TradeAlerts'
import SectorBreakdown from '../Widgets/SectorBreakdown'
import Watchlist from '../Widgets/Watchlist'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface DashboardProps {
  portfolio: Portfolio
}

const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  sentiment: SentimentGauge,
  holdings: HoldingsTable,
  news: NewsFeed,
  reddit: RedditFeed,
  chart: PriceChart,
  trades: TradeAlerts,
  sectors: SectorBreakdown,
  watchlist: Watchlist,
}

const WIDGET_TITLES: Record<string, string> = {
  sentiment: 'Sentiment Analysis',
  holdings: 'Current Holdings',
  news: 'News Feed',
  reddit: 'Reddit Mentions',
  chart: 'Price Chart',
  trades: 'Recent Trades',
  sectors: 'Sector Breakdown',
  watchlist: 'Watchlist',
}

export default function Dashboard({ portfolio }: DashboardProps) {
  const [layouts, setLayouts] = useState(
    portfolio.widgets.map(w => ({
      i: w.id,
      x: w.x,
      y: w.y,
      w: w.w,
      h: w.h,
      minW: 2,
      minH: 2,
    }))
  )

  const onLayoutChange = useCallback((newLayout: any[]) => {
    setLayouts(newLayout)
    // TODO: Save layout to backend
  }, [])

  const trackedNames = portfolio.people.map(p => p.name)

  return (
    <div className="dashboard-container">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{portfolio.name}</h1>
          {portfolio.description && (
            <p className="text-text-secondary text-sm mt-1">{portfolio.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            Tracking: {trackedNames.join(', ')}
          </span>
        </div>
      </div>

      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={80}
        width={1200}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
        isResizable={true}
        isDraggable={true}
        compactType="vertical"
        preventCollision={false}
      >
        {portfolio.widgets.map((widget) => {
          const WidgetComponent = WIDGET_COMPONENTS[widget.type]
          if (!WidgetComponent) return null

          return (
            <div key={widget.id} className="widget-container">
              <WidgetWrapper title={WIDGET_TITLES[widget.type] || widget.type}>
                <WidgetComponent
                  portfolio={portfolio}
                  trackedNames={trackedNames}
                />
              </WidgetWrapper>
            </div>
          )
        })}
      </GridLayout>

      {portfolio.widgets.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary">
            No widgets configured for this portfolio.
          </p>
        </div>
      )}
    </div>
  )
}
