from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

# Mock trade data
MOCK_TRADES = [
    {
        "id": "1",
        "person": "Nancy Pelosi",
        "ticker": "NVDA",
        "company": "NVIDIA Corporation",
        "type": "buy",
        "amount": "$1,000,001 - $5,000,000",
        "date": "2024-01-15",
        "filed_date": "2024-01-20"
    },
    {
        "id": "2",
        "person": "Nancy Pelosi",
        "ticker": "AAPL",
        "company": "Apple Inc.",
        "type": "buy",
        "amount": "$500,001 - $1,000,000",
        "date": "2024-01-10",
        "filed_date": "2024-01-16"
    },
    {
        "id": "3",
        "person": "Dan Crenshaw",
        "ticker": "MSFT",
        "company": "Microsoft Corporation",
        "type": "buy",
        "amount": "$15,001 - $50,000",
        "date": "2024-01-12",
        "filed_date": "2024-01-18"
    },
    {
        "id": "4",
        "person": "Tommy Tuberville",
        "ticker": "GOOGL",
        "company": "Alphabet Inc.",
        "type": "sell",
        "amount": "$100,001 - $250,000",
        "date": "2024-01-08",
        "filed_date": "2024-01-14"
    }
]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract name from path
        path_parts = self.path.split('/')
        name = urllib.parse.unquote(path_parts[-1].split('?')[0]).lower()

        # Filter trades by name
        trades = [t for t in MOCK_TRADES if name in t['person'].lower()]

        # If no trades found for this person, return all mock trades
        if not trades:
            trades = MOCK_TRADES[:5]

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(trades).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
