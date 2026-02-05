const MOCK_SENTIMENT = {
  "nancy pelosi": { overall: 45, reddit: 38, news: 52, trend: "up", mentions: 1247 },
  "dan crenshaw": { overall: 62, reddit: 58, news: 66, trend: "up", mentions: 892 },
  "warren buffett": { overall: 78, reddit: 82, news: 74, trend: "neutral", mentions: 2341 },
  "ray dalio": { overall: 55, reddit: 48, news: 62, trend: "down", mentions: 567 },
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query } = req.query;
  const key = (query || '').toLowerCase();

  const sentiment = MOCK_SENTIMENT[key] || {
    overall: 50,
    reddit: 50,
    news: 50,
    trend: "neutral",
    mentions: 100
  };

  res.json(sentiment);
}
