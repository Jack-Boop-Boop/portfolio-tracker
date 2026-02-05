const MOCK_TRADES = [
  {
    id: "1",
    person: "Nancy Pelosi",
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    type: "buy",
    amount: "$1,000,001 - $5,000,000",
    date: "2024-01-15",
    filed_date: "2024-01-20"
  },
  {
    id: "2",
    person: "Nancy Pelosi",
    ticker: "AAPL",
    company: "Apple Inc.",
    type: "buy",
    amount: "$500,001 - $1,000,000",
    date: "2024-01-10",
    filed_date: "2024-01-16"
  },
  {
    id: "3",
    person: "Dan Crenshaw",
    ticker: "MSFT",
    company: "Microsoft Corporation",
    type: "buy",
    amount: "$15,001 - $50,000",
    date: "2024-01-12",
    filed_date: "2024-01-18"
  },
  {
    id: "4",
    person: "Tommy Tuberville",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    type: "sell",
    amount: "$100,001 - $250,000",
    date: "2024-01-08",
    filed_date: "2024-01-14"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name } = req.query;
  const searchName = (name || '').toLowerCase();

  let trades = MOCK_TRADES.filter(t =>
    t.person.toLowerCase().includes(searchName)
  );

  if (trades.length === 0) {
    trades = MOCK_TRADES.slice(0, 5);
  }

  res.json(trades);
}
