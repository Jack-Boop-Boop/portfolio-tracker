export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;
  const now = new Date();

  const news = [
    {
      id: "news1",
      title: `${query} Makes Headlines With New Investment Strategy`,
      source: "Financial Times",
      url: "https://example.com/news1",
      published_at: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      related_tickers: ["AAPL", "MSFT", "NVDA"]
    },
    {
      id: "news2",
      title: `Market Watch: ${query}'s Portfolio Changes Analyzed`,
      source: "Bloomberg",
      url: "https://example.com/news2",
      published_at: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral",
      related_tickers: ["TSLA", "AMZN"]
    },
    {
      id: "news3",
      title: `Experts React to ${query}'s Recent Disclosures`,
      source: "Reuters",
      url: "https://example.com/news3",
      published_at: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive",
      related_tickers: ["GOOGL", "META"]
    }
  ];

  res.json(news);
}
