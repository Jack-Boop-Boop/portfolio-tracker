import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Trash2, User, Building2, ArrowRight, ArrowLeft,
  CheckCircle, Newspaper, MessageSquare, Hash, LayoutGrid
} from 'lucide-react'
import { PortfolioFormData, DataSource, WidgetType } from '../../types'

interface PortfolioRequestFormProps {
  onSubmit: (data: PortfolioFormData) => void
  onCancel: () => void
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Track People', icon: Building2 },
  { id: 3, title: 'Data Sources', icon: Newspaper },
  { id: 4, title: 'Widgets', icon: LayoutGrid },
]

const DATA_SOURCES: { id: DataSource; label: string; icon: any; description: string }[] = [
  { id: 'reddit', label: 'Reddit', icon: MessageSquare, description: 'Track mentions on r/wallstreetbets, r/stocks, etc.' },
  { id: 'news', label: 'News', icon: Newspaper, description: 'Headlines from major financial news sources' },
  { id: 'threads', label: 'Threads', icon: Hash, description: 'Social media discussions and sentiment' },
]

const WIDGETS: { id: WidgetType; label: string; description: string }[] = [
  { id: 'sentiment', label: 'Sentiment Gauge', description: 'Overall sentiment analysis' },
  { id: 'holdings', label: 'Holdings Table', description: 'Current disclosed positions' },
  { id: 'news', label: 'News Feed', description: 'Relevant news articles' },
  { id: 'reddit', label: 'Reddit Feed', description: 'Reddit mentions and discussions' },
  { id: 'chart', label: 'Price Chart', description: 'Stock price visualization' },
  { id: 'trades', label: 'Trade Alerts', description: 'Recent buy/sell activity' },
  { id: 'sectors', label: 'Sector Breakdown', description: 'Holdings by sector' },
  { id: 'watchlist', label: 'Watchlist', description: 'Quick view of tracked people' },
]

export default function PortfolioRequestForm({ onSubmit, onCancel }: PortfolioRequestFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<PortfolioFormData>({
    name: '',
    description: '',
    people: [],
    data_sources: ['reddit', 'news'],
    widgets: ['sentiment', 'holdings', 'news', 'chart', 'trades'],
  })

  const [newPerson, setNewPerson] = useState({ name: '', type: 'politician' as const })

  const handleAddPerson = () => {
    if (newPerson.name.trim()) {
      setFormData({
        ...formData,
        people: [...formData.people, { ...newPerson, name: newPerson.name.trim() }],
      })
      setNewPerson({ name: '', type: 'politician' })
    }
  }

  const handleRemovePerson = (index: number) => {
    setFormData({
      ...formData,
      people: formData.people.filter((_, i) => i !== index),
    })
  }

  const toggleDataSource = (source: DataSource) => {
    const sources = formData.data_sources.includes(source)
      ? formData.data_sources.filter(s => s !== source)
      : [...formData.data_sources, source]
    setFormData({ ...formData, data_sources: sources })
  }

  const toggleWidget = (widget: WidgetType) => {
    const widgets = formData.widgets.includes(widget)
      ? formData.widgets.filter(w => w !== widget)
      : [...formData.widgets, widget]
    setFormData({ ...formData, widgets })
  }

  const handleSubmit = () => {
    if (formData.name && formData.people.length > 0) {
      onSubmit(formData)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0
      case 2:
        return formData.people.length > 0
      case 3:
        return formData.data_sources.length > 0
      case 4:
        return formData.widgets.length > 0
      default:
        return true
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Portfolio</h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-terminal-hover rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${step === s.id
                  ? 'bg-accent-primary text-terminal-bg'
                  : step > s.id
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'bg-terminal-card text-text-muted'
                }`}
            >
              {step > s.id ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${step > s.id ? 'bg-accent-primary' : 'bg-terminal-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-terminal-card rounded-xl border border-terminal-border p-6 mb-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Name your portfolio
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">
                    Portfolio Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Congress Watch, Hedge Fund Tracker"
                    className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg
                             text-text-primary placeholder-text-muted focus:outline-none
                             focus:border-accent-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's this portfolio for?"
                    rows={3}
                    className="w-full px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg
                             text-text-primary placeholder-text-muted focus:outline-none
                             focus:border-accent-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Add People */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Who do you want to track?
              </h2>

              {/* Add Person Form */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                  placeholder="Enter name (e.g., Nancy Pelosi)"
                  className="flex-1 px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg
                           text-text-primary placeholder-text-muted focus:outline-none
                           focus:border-accent-primary transition-colors"
                />
                <select
                  value={newPerson.type}
                  onChange={(e) => setNewPerson({ ...newPerson, type: e.target.value as any })}
                  className="px-4 py-3 bg-terminal-bg border border-terminal-border rounded-lg
                           text-text-primary focus:outline-none focus:border-accent-primary"
                >
                  <option value="politician">Politician</option>
                  <option value="hedge_fund">Hedge Fund</option>
                </select>
                <button
                  onClick={handleAddPerson}
                  disabled={!newPerson.name.trim()}
                  className="px-4 py-3 bg-accent-primary text-terminal-bg rounded-lg
                           hover:bg-accent-secondary transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* People List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.people.length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Add people to track their trades and sentiment</p>
                  </div>
                ) : (
                  formData.people.map((person, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-terminal-bg rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-terminal-border flex items-center justify-center">
                          {person.type === 'politician' ? (
                            <User className="w-4 h-4 text-text-muted" />
                          ) : (
                            <Building2 className="w-4 h-4 text-text-muted" />
                          )}
                        </div>
                        <div>
                          <div className="text-text-primary font-medium">{person.name}</div>
                          <div className="text-xs text-text-muted capitalize">{person.type.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemovePerson(index)}
                        className="p-2 text-text-muted hover:text-negative hover:bg-negative/10
                                 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Data Sources */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Choose your data sources
              </h2>

              <div className="space-y-3">
                {DATA_SOURCES.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => toggleDataSource(source.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all
                      ${formData.data_sources.includes(source.id)
                        ? 'border-accent-primary bg-accent-glow'
                        : 'border-terminal-border bg-terminal-bg hover:border-terminal-hover'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                      ${formData.data_sources.includes(source.id)
                        ? 'bg-accent-primary text-terminal-bg'
                        : 'bg-terminal-border text-text-muted'
                      }`}
                    >
                      <source.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-text-primary">{source.label}</div>
                      <div className="text-sm text-text-muted">{source.description}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${formData.data_sources.includes(source.id)
                        ? 'border-accent-primary bg-accent-primary'
                        : 'border-terminal-border'
                      }`}
                    >
                      {formData.data_sources.includes(source.id) && (
                        <CheckCircle className="w-3 h-3 text-terminal-bg" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Widgets */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                Select your dashboard widgets
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {WIDGETS.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-4 rounded-lg border text-left transition-all
                      ${formData.widgets.includes(widget.id)
                        ? 'border-accent-primary bg-accent-glow'
                        : 'border-terminal-border bg-terminal-bg hover:border-terminal-hover'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-text-primary text-sm">{widget.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${formData.widgets.includes(widget.id)
                          ? 'border-accent-primary bg-accent-primary'
                          : 'border-terminal-border'
                        }`}
                      >
                        {formData.widgets.includes(widget.id) && (
                          <CheckCircle className="w-2.5 h-2.5 text-terminal-bg" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">{widget.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 text-text-secondary
                   hover:text-text-primary transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-terminal-bg
                     font-medium rounded-lg hover:bg-accent-secondary transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-terminal-bg
                     font-medium rounded-lg hover:bg-accent-secondary transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Create Portfolio
          </button>
        )}
      </div>
    </div>
  )
}
