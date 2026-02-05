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
    person: "Dan Crenshaw",
    ticker: "MSFT",
    company: "Microsoft Corporation",
    type: "buy",
    amount: "$15,001 - $50,000",
    date: "2024-01-12",
    filed_date: "2024-01-18"
  },
  {
    id: "3",
    person: "Nancy Pelosi",
    ticker: "AAPL",
    company: "Apple Inc.",
    type: "sell",
    amount: "$250,001 - $500,000",
    date: "2024-01-10",
    filed_date: "2024-01-16"
  },
  {
    id: "4",
    person: "Tommy Tuberville",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    type: "buy",
    amount: "$100,001 - $250,000",
    date: "2024-01-08",
    filed_date: "2024-01-14"
  },
  {
    id: "5",
    person: "Mark Green",
    ticker: "TSLA",
    company: "Tesla, Inc.",
    type: "sell",
    amount: "$50,001 - $100,000",
    date: "2024-01-05",
    filed_date: "2024-01-12"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.json(MOCK_TRADES);
}
