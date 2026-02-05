from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

# Mock holdings data
MOCK_HOLDINGS = [
    {"ticker": "NVDA", "company": "NVIDIA Corporation", "value": "$1M - $5M", "sector": "Technology", "change_percent": 12.5},
    {"ticker": "AAPL", "company": "Apple Inc.", "value": "$500K - $1M", "sector": "Technology", "change_percent": 3.2},
    {"ticker": "MSFT", "company": "Microsoft Corporation", "value": "$250K - $500K", "sector": "Technology", "change_percent": -1.8},
    {"ticker": "GOOGL", "company": "Alphabet Inc.", "value": "$100K - $250K", "sector": "Technology", "change_percent": 5.6},
    {"ticker": "TSLA", "company": "Tesla, Inc.", "value": "$50K - $100K", "sector": "Automotive", "change_percent": -8.3},
    {"ticker": "AMZN", "company": "Amazon.com Inc.", "value": "$100K - $250K", "sector": "Consumer", "change_percent": 2.1},
]


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(MOCK_HOLDINGS).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
