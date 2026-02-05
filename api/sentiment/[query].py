from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

# Mock sentiment data
MOCK_SENTIMENT = {
    "nancy pelosi": {"overall": 45, "reddit": 38, "news": 52, "trend": "up", "mentions": 1247},
    "dan crenshaw": {"overall": 62, "reddit": 58, "news": 66, "trend": "up", "mentions": 892},
    "warren buffett": {"overall": 78, "reddit": 82, "news": 74, "trend": "neutral", "mentions": 2341},
    "ray dalio": {"overall": 55, "reddit": 48, "news": 62, "trend": "down", "mentions": 567},
}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Extract query from path
        path_parts = self.path.split('/')
        query = urllib.parse.unquote(path_parts[-1].split('?')[0]).lower()

        # Get sentiment data
        sentiment = MOCK_SENTIMENT.get(query, {
            "overall": 50,
            "reddit": 50,
            "news": 50,
            "trend": "neutral",
            "mentions": 100
        })

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(sentiment).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
