// Portfolio types
export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  people: TrackedPerson[];
  widgets: WidgetLayout[];
  data_sources: DataSource[];
}

export interface TrackedPerson {
  id: number;
  portfolio_id: number;
  name: string;
  type: 'politician' | 'hedge_fund';
  identifier?: string;
  image_url?: string;
}

export interface WidgetLayout {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export type WidgetType =
  | 'sentiment'
  | 'holdings'
  | 'news'
  | 'reddit'
  | 'chart'
  | 'trades'
  | 'sectors'
  | 'watchlist';

export type DataSource = 'reddit' | 'news' | 'threads';

// Trade data
export interface Trade {
  id: string;
  person: string;
  ticker: string;
  company: string;
  type: 'buy' | 'sell';
  amount: string;
  date: string;
  filed_date: string;
}

// Holdings data
export interface Holding {
  ticker: string;
  company: string;
  shares?: number;
  value: string;
  sector: string;
  change_percent: number;
}

// Sentiment data
export interface SentimentData {
  overall: number; // -100 to 100
  reddit: number;
  news: number;
  threads?: number;
  trend: 'up' | 'down' | 'neutral';
  mentions: number;
}

// News item
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  published_at: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  related_tickers?: string[];
}

// Reddit post
export interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  score: number;
  num_comments: number;
  url: string;
  created_at: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// Stock chart data
export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Sector breakdown
export interface SectorData {
  name: string;
  value: number;
  color: string;
}

// Form data for creating portfolio
export interface PortfolioFormData {
  name: string;
  description: string;
  people: {
    name: string;
    type: 'politician' | 'hedge_fund';
  }[];
  data_sources: DataSource[];
  widgets: WidgetType[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
