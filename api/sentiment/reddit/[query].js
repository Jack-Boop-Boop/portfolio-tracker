export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;
  const now = new Date();

  const posts = [
    {
      id: "abc123",
      title: `Discussion about ${query}'s latest trades`,
      subreddit: "wallstreetbets",
      author: "trader_joe",
      score: 1542,
      num_comments: 234,
      url: "https://reddit.com/r/wallstreetbets/comments/abc123",
      created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive"
    },
    {
      id: "def456",
      title: `What do you think about ${query}?`,
      subreddit: "stocks",
      author: "market_watcher",
      score: 856,
      num_comments: 156,
      url: "https://reddit.com/r/stocks/comments/def456",
      created_at: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      sentiment: "neutral"
    },
    {
      id: "ghi789",
      title: `Breaking: ${query} makes major move`,
      subreddit: "investing",
      author: "finance_guru",
      score: 2103,
      num_comments: 412,
      url: "https://reddit.com/r/investing/comments/ghi789",
      created_at: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
      sentiment: "positive"
    }
  ];

  res.json(posts);
}
