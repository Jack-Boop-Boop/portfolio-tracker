from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract query from path
        path_parts = self.path.split('/')
        query = urllib.parse.unquote(path_parts[-1].split('?')[0])

        # Mock Reddit posts
        posts = [
            {
                "id": "abc123",
                "title": f"Discussion about {query}'s latest trades",
                "subreddit": "wallstreetbets",
                "author": "trader_joe",
                "score": 1542,
                "num_comments": 234,
                "url": "https://reddit.com/r/wallstreetbets/comments/abc123",
                "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
                "sentiment": "positive"
            },
            {
                "id": "def456",
                "title": f"What do you think about {query}?",
                "subreddit": "stocks",
                "author": "market_watcher",
                "score": 856,
                "num_comments": 156,
                "url": "https://reddit.com/r/stocks/comments/def456",
                "created_at": (datetime.now() - timedelta(hours=5)).isoformat(),
                "sentiment": "neutral"
            },
            {
                "id": "ghi789",
                "title": f"Breaking: {query} makes major move",
                "subreddit": "investing",
                "author": "finance_guru",
                "score": 2103,
                "num_comments": 412,
                "url": "https://reddit.com/r/investing/comments/ghi789",
                "created_at": (datetime.now() - timedelta(hours=8)).isoformat(),
                "sentiment": "positive"
            }
        ]

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(posts).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
