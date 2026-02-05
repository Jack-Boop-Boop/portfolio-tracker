from fastapi import APIRouter, HTTPException
from typing import Optional
import httpx
from datetime import datetime, timedelta

router = APIRouter()


# House Stock Watcher API (free)
HOUSE_STOCK_WATCHER_API = "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json"

# Cache for API responses
_trades_cache = {"data": None, "timestamp": None}
CACHE_DURATION = timedelta(hours=1)


@router.get("/politician/{name}")
async def get_politician_trades(name: str, limit: int = 20):
    """Get trades for a specific politician"""
    trades = await _get_all_trades()

    # Filter by name (case-insensitive partial match)
    name_lower = name.lower()
    filtered = [
        t for t in trades
        if name_lower in t.get("representative", "").lower()
    ]

    # Sort by transaction date descending
    filtered.sort(key=lambda x: x.get("transaction_date", ""), reverse=True)

    # Transform to our format
    result = []
    for trade in filtered[:limit]:
        result.append({
            "id": f"{trade.get('representative', '')}-{trade.get('transaction_date', '')}-{trade.get('ticker', '')}",
            "person": trade.get("representative", "Unknown"),
            "ticker": trade.get("ticker", "N/A"),
            "company": trade.get("asset_description", "Unknown Company"),
            "type": "buy" if "purchase" in trade.get("type", "").lower() else "sell",
            "amount": trade.get("amount", "Unknown"),
            "date": trade.get("transaction_date", ""),
            "filed_date": trade.get("disclosure_date", "")
        })

    return result


@router.get("/recent")
async def get_recent_trades(limit: int = 50):
    """Get most recent trades across all tracked politicians"""
    trades = await _get_all_trades()

    # Sort by disclosure date descending
    trades.sort(key=lambda x: x.get("disclosure_date", ""), reverse=True)

    result = []
    for trade in trades[:limit]:
        result.append({
            "id": f"{trade.get('representative', '')}-{trade.get('transaction_date', '')}-{trade.get('ticker', '')}",
            "person": trade.get("representative", "Unknown"),
            "ticker": trade.get("ticker", "N/A"),
            "company": trade.get("asset_description", "Unknown Company"),
            "type": "buy" if "purchase" in trade.get("type", "").lower() else "sell",
            "amount": trade.get("amount", "Unknown"),
            "date": trade.get("transaction_date", ""),
            "filed_date": trade.get("disclosure_date", "")
        })

    return result


@router.get("/holdings/{name}")
async def get_holdings(name: str):
    """Get estimated current holdings for a person"""
    trades = await _get_all_trades()

    # Filter by name
    name_lower = name.lower()
    person_trades = [
        t for t in trades
        if name_lower in t.get("representative", "").lower()
    ]

    # Calculate holdings (simplified - just shows recent purchases)
    holdings = {}
    for trade in person_trades:
        ticker = trade.get("ticker", "")
        if not ticker or ticker == "--":
            continue

        trade_type = trade.get("type", "").lower()
        if "purchase" in trade_type:
            if ticker not in holdings:
                holdings[ticker] = {
                    "ticker": ticker,
                    "company": trade.get("asset_description", "Unknown"),
                    "value": trade.get("amount", "Unknown"),
                    "sector": _get_sector(ticker),
                    "change_percent": 0  # Would need price data to calculate
                }

    return list(holdings.values())[:20]


@router.get("/stock/{symbol}")
async def get_stock_data(symbol: str, period: str = "1mo"):
    """Get stock price data for a symbol"""
    try:
        import yfinance as yf
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)

        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock not found")

        data = []
        for date, row in hist.iterrows():
            data.append({
                "time": date.strftime("%Y-%m-%d"),
                "open": round(row["Open"], 2),
                "high": round(row["High"], 2),
                "low": round(row["Low"], 2),
                "close": round(row["Close"], 2),
                "volume": int(row["Volume"])
            })

        return data

    except ImportError:
        # yfinance not installed, return mock data
        return _mock_stock_data(symbol)
    except Exception as e:
        return _mock_stock_data(symbol)


async def _get_all_trades() -> list:
    """Fetch all trades from House Stock Watcher (cached)"""
    global _trades_cache

    # Check cache
    if _trades_cache["data"] and _trades_cache["timestamp"]:
        if datetime.now() - _trades_cache["timestamp"] < CACHE_DURATION:
            return _trades_cache["data"]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(HOUSE_STOCK_WATCHER_API, timeout=30.0)
            if response.status_code == 200:
                data = response.json()
                _trades_cache["data"] = data
                _trades_cache["timestamp"] = datetime.now()
                return data
    except Exception as e:
        print(f"Error fetching trades: {e}")

    # Return cached data if available, otherwise empty list
    return _trades_cache["data"] or []


def _get_sector(ticker: str) -> str:
    """Get sector for a ticker (simplified mapping)"""
    sectors = {
        "AAPL": "Technology", "MSFT": "Technology", "GOOGL": "Technology",
        "AMZN": "Consumer Cyclical", "TSLA": "Automotive",
        "NVDA": "Technology", "META": "Technology",
        "JPM": "Financial", "BAC": "Financial", "WFC": "Financial",
        "JNJ": "Healthcare", "PFE": "Healthcare", "UNH": "Healthcare",
        "XOM": "Energy", "CVX": "Energy",
    }
    return sectors.get(ticker.upper(), "Other")


def _mock_stock_data(symbol: str) -> list:
    """Generate mock stock data for demo"""
    import random
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
