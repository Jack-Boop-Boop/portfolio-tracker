import { useState, useEffect } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Layout/Dashboard'
import PortfolioRequestForm from './components/Forms/PortfolioRequestForm'
import { Portfolio, PortfolioFormData, WidgetType } from './types'
import { api } from './services/api'

const STORAGE_KEY = 'portfolio_tracker_data'

// Default widget layouts
const defaultWidgets: Record<string, { w: number; h: number }> = {
  sentiment: { w: 3, h: 3 },
  holdings: { w: 6, h: 4 },
  news: { w: 4, h: 4 },
  reddit: { w: 4, h: 4 },
  chart: { w: 6, h: 4 },
  trades: { w: 5, h: 4 },
  sectors: { w: 3, h: 3 },
  watchlist: { w: 3, h: 4 },
}

// Create portfolio locally
function createLocalPortfolio(data: PortfolioFormData, existingPortfolios: Portfolio[]): Portfolio {
  const id = Date.now()

  const widgets: Portfolio['widgets'] = []
  let x = 0, y = 0, maxH = 0

  data.widgets.forEach((type, i) => {
    const layout = defaultWidgets[type] || { w: 4, h: 3 }
    if (x + layout.w > 12) {
      x = 0
      y += maxH
      maxH = 0
    }
    widgets.push({
      id: `${type}-${i}`,
      type: type as WidgetType,
      x, y,
      w: layout.w,
      h: layout.h,
    })
    x += layout.w
    maxH = Math.max(maxH, layout.h)
  })

  return {
    id,
    name: data.name,
    description: data.description,
    created_at: new Date().toISOString(),
    people: data.people.map((p, i) => ({
      id: i,
      portfolio_id: id,
      name: p.name,
      type: p.type,
    })),
    widgets,
    data_sources: data.data_sources,
  }
}

// Load from localStorage
function loadFromStorage(): Portfolio[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Save to localStorage
function saveToStorage(portfolios: Portfolio[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    // First load from localStorage
    const localData = loadFromStorage()
    if (localData.length > 0) {
      setPortfolios(localData)
      setActivePortfolio(localData[0])
    }

    // Then try API
    try {
      const apiData = await api.getPortfolios()
      if (apiData.length > 0) {
        // Merge API data with local data
        const merged = [...localData]
        apiData.forEach(p => {
          if (!merged.find(m => m.id === p.id)) {
            merged.push(p)
          }
        })
        setPortfolios(merged)
        if (!activePortfolio && merged.length > 0) {
          setActivePortfolio(merged[0])
        }
      }
    } catch (error) {
      console.log('API not available, using local storage')
    }
  }

  const handleCreatePortfolio = async (formData: PortfolioFormData) => {
    // Create locally first
    const newPortfolio = createLocalPortfolio(formData, portfolios)
    const updated = [...portfolios, newPortfolio]

    setPortfolios(updated)
    setActivePortfolio(newPortfolio)
    setShowForm(false)

    // Save to localStorage
    saveToStorage(updated)

    // Try API in background
    try {
      await api.createPortfolio(formData)
    } catch (error) {
      console.log('API save failed, portfolio saved locally')
    }
  }

  const handleDeletePortfolio = async (id: number) => {
    const updated = portfolios.filter(p => p.id !== id)
    setPortfolios(updated)
    saveToStorage(updated)

    if (activePortfolio?.id === id) {
      setActivePortfolio(updated[0] || null)
    }

    try {
      await api.deletePortfolio(id)
    } catch (error) {
      console.log('API delete failed, deleted locally')
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNewPortfolio={() => setShowForm(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          portfolios={portfolios}
          activePortfolio={activePortfolio}
          onSelectPortfolio={setActivePortfolio}
          onDeletePortfolio={handleDeletePortfolio}
          onNewPortfolio={() => setShowForm(true)}
        />

        <main className="flex-1 overflow-auto p-4">
          {showForm ? (
            <PortfolioRequestForm
              onSubmit={handleCreatePortfolio}
              onCancel={() => setShowForm(false)}
            />
          ) : activePortfolio ? (
            <Dashboard portfolio={activePortfolio} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Welcome to Portfolio Tracker
                </h2>
                <p className="text-text-secondary mb-6">
                  Track politicians and hedge fund managers with real-time sentiment analysis
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-accent-primary text-terminal-bg font-semibold rounded-lg
                           hover:bg-accent-secondary transition-colors duration-200"
                >
                  Create Your First Portfolio
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
