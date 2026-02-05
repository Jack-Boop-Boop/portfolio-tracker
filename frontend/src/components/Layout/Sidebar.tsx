import { Plus, Trash2, Briefcase, ChevronRight } from 'lucide-react'
import { Portfolio } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  portfolios: Portfolio[]
  activePortfolio: Portfolio | null
  onSelectPortfolio: (portfolio: Portfolio) => void
  onDeletePortfolio: (id: number) => void
  onNewPortfolio: () => void
}

export default function Sidebar({
  isOpen,
  portfolios,
  activePortfolio,
  onSelectPortfolio,
  onDeletePortfolio,
  onNewPortfolio,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-terminal-card border-r border-terminal-border overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-terminal-border">
            <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
              Your Portfolios
            </h2>
            <button
              onClick={onNewPortfolio}
              className="w-full flex items-center justify-center gap-2 py-2 px-3
                       border border-dashed border-terminal-border rounded-lg
                       text-text-secondary hover:text-accent-primary hover:border-accent-primary
                       transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Create Portfolio</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {portfolios.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                No portfolios yet
              </div>
            ) : (
              <ul className="space-y-1">
                {portfolios.map((portfolio) => (
                  <li key={portfolio.id}>
                    <button
                      onClick={() => onSelectPortfolio(portfolio)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                        ${activePortfolio?.id === portfolio.id
                          ? 'bg-accent-glow border border-accent-primary/30 text-text-primary'
                          : 'hover:bg-terminal-hover text-text-secondary hover:text-text-primary'
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                        ${activePortfolio?.id === portfolio.id
                          ? 'bg-accent-primary text-terminal-bg'
                          : 'bg-terminal-border text-text-secondary'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">{portfolio.name}</div>
                        <div className="text-xs text-text-muted truncate">
                          {portfolio.people.length} tracked
                        </div>
                      </div>

                      {activePortfolio?.id === portfolio.id && (
                        <ChevronRight className="w-4 h-4 text-accent-primary" />
                      )}
                    </button>

                    {activePortfolio?.id === portfolio.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-11 mt-1 mb-2"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Delete this portfolio?')) {
                              onDeletePortfolio(portfolio.id)
                            }
                          }}
                          className="flex items-center gap-2 text-xs text-text-muted
                                   hover:text-negative transition-colors py-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-terminal-border">
            <div className="text-xs text-text-muted">
              Data refreshes every 5 minutes
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
