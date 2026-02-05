import { Menu, Plus, Bell, Settings, TrendingUp } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
  onNewPortfolio: () => void
}

export default function Header({ onToggleSidebar, onNewPortfolio }: HeaderProps) {
  return (
    <header className="h-14 bg-terminal-card border-b border-terminal-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-terminal-hover rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-terminal-bg" />
          </div>
          <span className="font-semibold text-text-primary text-lg">
            Portfolio Tracker
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewPortfolio}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-terminal-bg
                   font-medium rounded-lg hover:bg-accent-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Portfolio</span>
        </button>

        <button className="p-2 hover:bg-terminal-hover rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-primary rounded-full" />
        </button>

        <button className="p-2 hover:bg-terminal-hover rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
    </header>
  )
}
