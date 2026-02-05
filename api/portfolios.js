// In-memory storage (resets on cold starts - use Vercel KV for persistence)
let portfolios = {};
let counter = 0;

const defaultWidgets = {
  sentiment: { w: 3, h: 3 },
  holdings: { w: 6, h: 4 },
  news: { w: 4, h: 4 },
  reddit: { w: 4, h: 4 },
  chart: { w: 6, h: 4 },
  trades: { w: 5, h: 4 },
  sectors: { w: 3, h: 3 },
  watchlist: { w: 3, h: 4 },
};

function createPortfolio(data) {
  counter++;
  const id = counter;

  let widgets = [];
  let x = 0, y = 0, maxH = 0;

  (data.widgets || []).forEach((type, i) => {
    const layout = defaultWidgets[type] || { w: 4, h: 3 };
    if (x + layout.w > 12) {
      x = 0;
      y += maxH;
      maxH = 0;
    }
    widgets.push({
      id: `${type}-${i}`,
      type: type,
      x, y,
      w: layout.w,
      h: layout.h,
    });
    x += layout.w;
    maxH = Math.max(maxH, layout.h);
  });

  const portfolio = {
    id,
    name: data.name || 'Untitled',
    description: data.description || '',
    data_sources: data.data_sources || [],
    created_at: new Date().toISOString(),
    updated_at: null,
    people: (data.people || []).map((p, i) => ({
      id: i,
      portfolio_id: id,
      name: p.name,
      type: p.type,
      identifier: p.identifier || null,
      image_url: p.image_url || null,
    })),
    widgets,
  };

  portfolios[id] = portfolio;
  return portfolio;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    if (id) {
      const portfolio = portfolios[parseInt(id)];
      if (!portfolio) {
        return res.status(404).json({ error: 'Portfolio not found' });
      }
      return res.json(portfolio);
    }
    return res.json(Object.values(portfolios));
  }

  if (req.method === 'POST') {
    const portfolio = createPortfolio(req.body);
    return res.status(201).json(portfolio);
  }

  if (req.method === 'DELETE' && id) {
    const portfolioId = parseInt(id);
    if (portfolios[portfolioId]) {
      delete portfolios[portfolioId];
      return res.json({ message: 'Deleted' });
    }
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
