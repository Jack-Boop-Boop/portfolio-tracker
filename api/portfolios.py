from http.server import BaseHTTPRequestHandler
import json
import os

# In-memory storage for Vercel (will reset on cold starts)
# For production, use a database service like Vercel KV or Supabase
portfolios_db = {}
portfolio_counter = [0]


def get_portfolios():
    return list(portfolios_db.values())


def get_portfolio(portfolio_id):
    return portfolios_db.get(portfolio_id)


def create_portfolio(data):
    portfolio_counter[0] += 1
    portfolio_id = portfolio_counter[0]

    # Default widget layouts
    default_widgets = {
        'sentiment': {'w': 3, 'h': 3},
        'holdings': {'w': 6, 'h': 4},
        'news': {'w': 4, 'h': 4},
        'reddit': {'w': 4, 'h': 4},
        'chart': {'w': 6, 'h': 4},
        'trades': {'w': 5, 'h': 4},
        'sectors': {'w': 3, 'h': 3},
        'watchlist': {'w': 3, 'h': 4},
    }

    # Build widgets with layout
    widgets = []
    x, y = 0, 0
    max_h = 0
    for i, widget_type in enumerate(data.get('widgets', [])):
        layout = default_widgets.get(widget_type, {'w': 4, 'h': 3})
        if x + layout['w'] > 12:
            x = 0
            y += max_h
            max_h = 0

        widgets.append({
            'id': len(widgets),
            'portfolio_id': portfolio_id,
            'widget_id': f"{widget_type}-{i}",
            'widget_type': widget_type,
            'x': x,
            'y': y,
            'w': layout['w'],
            'h': layout['h'],
        })
        x += layout['w']
        max_h = max(max_h, layout['h'])

    portfolio = {
        'id': portfolio_id,
        'name': data.get('name', 'Untitled'),
        'description': data.get('description', ''),
        'data_sources': data.get('data_sources', []),
        'created_at': '2024-01-01T00:00:00',
        'updated_at': None,
        'people': [
            {
                'id': i,
                'portfolio_id': portfolio_id,
                'name': p.get('name'),
                'type': p.get('type'),
                'identifier': p.get('identifier'),
                'image_url': p.get('image_url'),
            }
            for i, p in enumerate(data.get('people', []))
        ],
        'widgets': widgets,
    }

    portfolios_db[portfolio_id] = portfolio
    return portfolio


def delete_portfolio(portfolio_id):
    if portfolio_id in portfolios_db:
        del portfolios_db[portfolio_id]
        return True
    return False


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse path
        path_parts = self.path.split('/')

        if len(path_parts) >= 3 and path_parts[2].isdigit():
            # GET /api/portfolios/{id}
            portfolio_id = int(path_parts[2])
            portfolio = get_portfolio(portfolio_id)

            if portfolio:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(portfolio).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Portfolio not found'}).encode())
        else:
            # GET /api/portfolios
            portfolios = get_portfolios()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(portfolios).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body) if body else {}

        portfolio = create_portfolio(data)

        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(portfolio).encode())

    def do_DELETE(self):
        path_parts = self.path.split('/')

        if len(path_parts) >= 3 and path_parts[2].isdigit():
            portfolio_id = int(path_parts[2])
            success = delete_portfolio(portfolio_id)

            if success:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'message': 'Deleted'}).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Not found'}).encode())
        else:
            self.send_response(400)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
