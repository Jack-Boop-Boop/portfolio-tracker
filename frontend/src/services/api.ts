import { Portfolio, PortfolioFormData, Trade, Holding, SentimentData, NewsItem, RedditPost, ChartDataPoint } from '../types'

const API_BASE = '/api'

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  // Portfolios
  async getPortfolios(): Promise<Portfolio[]> {
    return fetchApi<Portfolio[]>('/portfolios')
  },

  async getPortfolio(id: number): Promise<Portfolio> {
    return fetchApi<Portfolio>(`/portfolios/${id}`)
  },

  async createPortfolio(data: PortfolioFormData): Promise<Portfolio> {
    return fetchApi<Portfolio>('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updatePortfolio(id: number, data: PortfolioFormData): Promise<Portfolio> {
    return fetchApi<Portfolio>(`/portfolios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deletePortfolio(id: number): Promise<void> {
    await fetchApi(`/portfolios/${id}`, { method: 'DELETE' })
  },

  // Trades
  async getPersonTrades(name: string, limit?: number): Promise<Trade[]> {
    const params = limit ? `?limit=${limit}` : ''
    return fetchApi<Trade[]>(`/trades/politician/${encodeURIComponent(name)}${params}`)
  },

  async getRecentTrades(limit?: number): Promise<Trade[]> {
    const params = limit ? `?limit=${limit}` : ''
    return fetchApi<Trade[]>(`/trades/recent${params}`)
  },

  async getHoldings(name: string): Promise<Holding[]> {
    return fetchApi<Holding[]>(`/trades/holdings/${encodeURIComponent(name)}`)
  },

  async getStockData(symbol: string, period?: string): Promise<ChartDataPoint[]> {
    const params = period ? `?period=${period}` : ''
    return fetchApi<ChartDataPoint[]>(`/trades/stock/${symbol}${params}`)
  },

  // Sentiment
  async getSentiment(query: string): Promise<SentimentData> {
    return fetchApi<SentimentData>(`/sentiment/${encodeURIComponent(query)}`)
  },

  async getRedditPosts(query: string, limit?: number): Promise<RedditPost[]> {
    const params = limit ? `?limit=${limit}` : ''
    return fetchApi<RedditPost[]>(`/sentiment/reddit/${encodeURIComponent(query)}${params}`)
  },

  async getNews(query: string, limit?: number): Promise<NewsItem[]> {
    const params = limit ? `?limit=${limit}` : ''
    return fetchApi<NewsItem[]>(`/sentiment/news/${encodeURIComponent(query)}${params}`)
  },
}

// Mock data for development when backend is not running
export const mockApi = {
  async getPortfolios(): Promise<Portfolio[]> {
    return [
      {
        id: 1,
        name: "Congress Watch",
        description: "Tracking key congressional traders",
        created_at: new Date().toISOString(),
        people: [
          { id: 1, portfolio_id: 1, name: "Nancy Pelosi", type: "politician" },
          { id: 2, portfolio_id: 1, name: "Dan Crenshaw", type: "politician" },
        ],
        widgets: [
          { id: "sentiment-1", type: "sentiment", x: 0, y: 0, w: 3, h: 3 },
          { id: "holdings-1", type: "holdings", x: 3, y: 0, w: 6, h: 4 },
          { id: "news-1", type: "news", x: 9, y: 0, w: 3, h: 4 },
          { id: "chart-1", type: "chart", x: 0, y: 3, w: 6, h: 4 },
          { id: "trades-1", type: "trades", x: 6, y: 4, w: 6, h: 4 },
        ],
        data_sources: ["reddit", "news"],
      }
    ]
  },

  async createPortfolio(data: PortfolioFormData): Promise<Portfolio> {
    return {
      id: Date.now(),
      name: data.name,
      description: data.description,
      created_at: new Date().toISOString(),
      people: data.people.map((p, i) => ({ id: i, portfolio_id: Date.now(), ...p })),
      widgets: data.widgets.map((type, i) => ({
        id: `${type}-${i}`,
        type,
        x: (i % 3) * 4,
        y: Math.floor(i / 3) * 4,
        w: 4,
        h: 4,
      })),
      data_sources: data.data_sources,
    }
  },
}
