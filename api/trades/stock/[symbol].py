from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from datetime import datetime, timedelta
import random


def generate_mock_data(symbol):
    """Generate mock stock data"""
    data = []
    base_price = random.uniform(50, 500)

    for i in range(30):
        date = (datetime.now() - timedelta(days=30-i)).strftime("%Y-%m-%d")
        daily_change = random.uniform(-0.03, 0.03)
        open_price = base_price * (1 + daily_change)
        high = open_price * (1 + random.uniform(0, 0.02))
        low = open_price * (1 - random.uniform(0, 0.02))
        close = random.uniform(low, high)

        data.append({
            "time": date,
            "open": round(open_price, 2),
            "high": round(high, 2),
            "low": round(low, 2),
            "close": round(close, 2),
            "volume": random.randint(1000000, 50000000)
        })

        base_price = close

    return data


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract symbol from path
        path_parts = self.path.split('/')
        symbol = urllib.parse.unquote(path_parts[-1].split('?')[0]).upper()

        # Generate mock data
        data = generate_mock_data(symbol)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
