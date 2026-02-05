from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract query from path
        path_parts = self.path.split('/')
        query = urllib.parse.unquote(path_parts[-1].split('?')[0])

        # Mock news items
        news = [
            {
                "id": "news1",
                "title": f"{query} Makes Headlines With New Investment Strategy",
                "source": "Financial Times",
                "url": "https://example.com/news1",
                "published_at": (datetime.now() - timedelta(hours=1)).isoformat(),
                "sentiment": "positive",
                "related_tickers": ["AAPL", "MSFT", "NVDA"]
            },
            {
                "id": "news2",
                "title": f"Market Watch: {query}'s Portfolio Changes Analyzed",
                "source": "Bloomberg",
                "url": "https://example.com/news2",
                "published_at": (datetime.now() - timedelta(hours=3)).isoformat(),
                "sentiment": "neutral",
                "related_tickers": ["TSLA", "AMZN"]
            },
            {
                "id": "news3",
                "title": f"Experts React to {query}'s Recent Disclosures",
                "source": "Reuters",
                "url": "https://example.com/news3",
                "published_at": (datetime.now() - timedelta(hours=6)).isoformat(),
                "sentiment": "positive",
                "related_tickers": ["GOOGL", "META"]
            }
        ]

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(news).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
