import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Dashboard from './components/Layout/Dashboard'
import PortfolioRequestForm from './components/Forms/PortfolioRequestForm'
import { Portfolio } from './types'
import { api } from './services/api'

function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    try {
      const data = await api.getPortfolios()
      setPortfolios(data)
      if (data.length > 0 && !activePortfolio) {
        setActivePortfolio(data[0])
      }
    } catch (error) {
      console.error('Failed to load portfolios:', error)
    }
  }

  const handleCreatePortfolio = async (formData: any) => {
    try {
      const newPortfolio = await api.createPortfolio(formData)
      setPortfolios([...portfolios, newPortfolio])
      setActivePortfolio(newPortfolio)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create portfolio:', error)
    }
  }

  const handleDeletePortfolio = async (id: number) => {
    try {
      await api.deletePortfolio(id)
      const updated = portfolios.filter(p => p.id !== id)
      setPortfolios(updated)
      if (activePortfolio?.id === id) {
        setActivePortfolio(updated[0] || null)
      }
    } catch (error) {
      console.error('Failed to delete portfolio:', error)
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
