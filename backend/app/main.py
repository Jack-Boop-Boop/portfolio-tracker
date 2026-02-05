from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import portfolios, sentiment, trades

app = FastAPI(
    title="Portfolio Tracker API",
    description="Track politicians and hedge fund managers with sentiment analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(portfolios.router, prefix="/api/portfolios", tags=["portfolios"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["sentiment"])
app.include_router(trades.router, prefix="/api/trades", tags=["trades"])

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Portfolio Tracker API", "status": "running"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
