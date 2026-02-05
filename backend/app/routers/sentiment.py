from fastapi import APIRouter, HTTPException
from typing import Optional
import httpx
import feedparser
from datetime import datetime, timedelta
import asyncio

router = APIRouter()


# Mock sentiment data for demo (will be replaced with real API calls)
MOCK_SENTIMENT = {
    "nancy pelosi": {"overall": 45, "reddit": 38, "news": 52, "trend": "up", "mentions": 1247},
    "dan crenshaw": {"overall": 62, "reddit": 58, "news": 66, "trend": "up", "mentions": 892},
    "warren buffett": {"overall": 78, "reddit": 82, "news": 74, "trend": "neutral", "mentions": 2341},
    "ray dalio": {"overall": 55, "reddit": 48, "news": 62, "trend": "down", "mentions": 567},
}


@router.get("/{query}")
async def get_sentiment(query: str):
    """Get sentiment data for a person or topic"""
    query_lower = query.lower()

    # Check mock data first
    if query_lower in MOCK_SENTIMENT:
        return MOCK_SENTIMENT[query_lower]

    # Try to fetch real sentiment (simplified for demo)
    try:
        reddit_sentiment = await _get_reddit_sentiment(query)
        news_sentiment = await _get_news_sentiment(query)

        overall = (reddit_sentiment + news_sentiment) // 2

        return {
            "overall": overall,
            "reddit": reddit_sentiment,
            "news": news_sentiment,
            "trend": "up" if overall > 50 else "down" if overall < 40 else "neutral",
            "mentions": 100  # Placeholder
        }
    except Exception:
        # Return neutral sentiment on error
        return {
            "overall": 50,
            "reddit": 50,
            "news": 50,
            "trend": "neutral",
            "mentions": 0
        }


@router.get("/reddit/{query}")
async def get_reddit_posts(query: str, limit: int = 10):
    """Get Reddit posts mentioning the query"""
    # For demo, return mock data
    # In production, use PRAW (Python Reddit API Wrapper)
    mock_posts = [
        {
            "id": "abc123",
            "title": f"Discussion about {query}'s latest trades",
            "subreddit": "wallstreetbets",
            "author": "trader_joe",
            "score": 1542,
            "num_comments": 234,
            "url": f"https://reddit.com/r/wallstreetbets/comments/abc123",
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
            "url": f"https://reddit.com/r/stocks/comments/def456",
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
            "url": f"https://reddit.com/r/investing/comments/ghi789",
            "created_at": (datetime.now() - timedelta(hours=8)).isoformat(),
            "sentiment": "positive"
        }
    ]

    return mock_posts[:limit]


@router.get("/news/{query}")
async def get_news(query: str, limit: int = 10):
    """Get news articles about the query"""
    # Try Google News RSS feed
    try:
        news_items = await _fetch_google_news(query, limit)
        if news_items:
            return news_items
    except Exception:
        pass

    # Fallback to mock data
    mock_news = [
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

    return mock_news[:limit]


async def _get_reddit_sentiment(query: str) -> int:
    """Calculate sentiment from Reddit mentions"""
    # Simplified - would use PRAW in production
    return 55  # Neutral-positive default


async def _get_news_sentiment(query: str) -> int:
    """Calculate sentiment from news articles"""
    # Simplified - would use NLP in production
    return 52  # Neutral-positive default


async def _fetch_google_news(query: str, limit: int) -> list:
    """Fetch news from Google News RSS"""
    url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10.0)
        if response.status_code != 200:
            return []

    feed = feedparser.parse(response.text)
    news_items = []

    for entry in feed.entries[:limit]:
        news_items.append({
            "id": entry.get("id", entry.link),
            "title": entry.title,
            "source": entry.get("source", {}).get("title", "Google News"),
            "url": entry.link,
            "published_at": entry.get("published", datetime.now().isoformat()),
            "sentiment": "neutral",  # Would use NLP to determine
            "related_tickers": []
        })

    return news_items
