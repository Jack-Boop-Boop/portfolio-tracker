from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models import Portfolio, PortfolioPerson, WidgetLayout
import uuid

router = APIRouter()


# Pydantic schemas
class PersonCreate(BaseModel):
    name: str
    type: str  # 'politician' or 'hedge_fund'
    identifier: Optional[str] = None
    image_url: Optional[str] = None


class WidgetCreate(BaseModel):
    widget_type: str
    x: int = 0
    y: int = 0
    w: int = 4
    h: int = 3


class PortfolioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    people: List[PersonCreate]
    data_sources: List[str] = []
    widgets: List[str] = []  # Widget types to add


class PersonResponse(BaseModel):
    id: int
    portfolio_id: int
    name: str
    type: str
    identifier: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True


class WidgetResponse(BaseModel):
    id: int
    portfolio_id: int
    widget_id: str
    widget_type: str
    x: int
    y: int
    w: int
    h: int

    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    data_sources: List[str]
    created_at: str
    updated_at: Optional[str]
    people: List[PersonResponse]
    widgets: List[WidgetResponse]

    class Config:
        from_attributes = True


# Default widget layouts
DEFAULT_WIDGET_LAYOUTS = {
    'sentiment': {'w': 3, 'h': 3, 'minW': 2, 'minH': 2},
    'holdings': {'w': 6, 'h': 4, 'minW': 4, 'minH': 3},
    'news': {'w': 4, 'h': 4, 'minW': 3, 'minH': 3},
    'reddit': {'w': 4, 'h': 4, 'minW': 3, 'minH': 3},
    'chart': {'w': 6, 'h': 4, 'minW': 4, 'minH': 3},
    'trades': {'w': 5, 'h': 4, 'minW': 4, 'minH': 3},
    'sectors': {'w': 3, 'h': 3, 'minW': 2, 'minH': 2},
    'watchlist': {'w': 3, 'h': 4, 'minW': 2, 'minH': 3},
}


@router.get("/", response_model=List[PortfolioResponse])
def get_portfolios(db: Session = Depends(get_db)):
    portfolios = db.query(Portfolio).all()
    return [_portfolio_to_response(p) for p in portfolios]


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return _portfolio_to_response(portfolio)


@router.post("/", response_model=PortfolioResponse)
def create_portfolio(portfolio_data: PortfolioCreate, db: Session = Depends(get_db)):
    # Create portfolio
    portfolio = Portfolio(
        name=portfolio_data.name,
        description=portfolio_data.description,
        data_sources=portfolio_data.data_sources
    )
    db.add(portfolio)
    db.flush()  # Get the ID

    # Add people
    for person_data in portfolio_data.people:
        person = PortfolioPerson(
            portfolio_id=portfolio.id,
            name=person_data.name,
            type=person_data.type,
            identifier=person_data.identifier,
            image_url=person_data.image_url
        )
        db.add(person)

    # Add widgets with automatic layout
    x, y = 0, 0
    max_row_height = 0
    cols = 12  # Grid columns

    for widget_type in portfolio_data.widgets:
        layout = DEFAULT_WIDGET_LAYOUTS.get(widget_type, {'w': 4, 'h': 3})

        # Check if widget fits in current row
        if x + layout['w'] > cols:
            x = 0
            y += max_row_height
            max_row_height = 0

        widget = WidgetLayout(
            portfolio_id=portfolio.id,
            widget_id=f"{widget_type}-{uuid.uuid4().hex[:8]}",
            widget_type=widget_type,
            x=x,
            y=y,
            w=layout['w'],
            h=layout['h']
        )
        db.add(widget)

        x += layout['w']
        max_row_height = max(max_row_height, layout['h'])

    db.commit()
    db.refresh(portfolio)

    return _portfolio_to_response(portfolio)


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(portfolio_id: int, portfolio_data: PortfolioCreate, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    portfolio.name = portfolio_data.name
    portfolio.description = portfolio_data.description
    portfolio.data_sources = portfolio_data.data_sources

    # Update people - remove old, add new
    db.query(PortfolioPerson).filter(PortfolioPerson.portfolio_id == portfolio_id).delete()
    for person_data in portfolio_data.people:
        person = PortfolioPerson(
            portfolio_id=portfolio.id,
            name=person_data.name,
            type=person_data.type,
            identifier=person_data.identifier,
            image_url=person_data.image_url
        )
        db.add(person)

    db.commit()
    db.refresh(portfolio)

    return _portfolio_to_response(portfolio)


@router.delete("/{portfolio_id}")
def delete_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    db.delete(portfolio)
    db.commit()

    return {"message": "Portfolio deleted successfully"}


@router.put("/{portfolio_id}/widgets")
def update_widget_layouts(
    portfolio_id: int,
    widgets: List[WidgetCreate],
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    # Update widget positions
    for widget_data in widgets:
        widget = db.query(WidgetLayout).filter(
            WidgetLayout.portfolio_id == portfolio_id,
            WidgetLayout.widget_type == widget_data.widget_type
        ).first()

        if widget:
            widget.x = widget_data.x
            widget.y = widget_data.y
            widget.w = widget_data.w
            widget.h = widget_data.h

    db.commit()
    return {"message": "Widget layouts updated"}


def _portfolio_to_response(portfolio: Portfolio) -> dict:
    return {
        "id": portfolio.id,
        "name": portfolio.name,
        "description": portfolio.description,
        "data_sources": portfolio.data_sources or [],
        "created_at": portfolio.created_at.isoformat() if portfolio.created_at else None,
        "updated_at": portfolio.updated_at.isoformat() if portfolio.updated_at else None,
        "people": [
            {
                "id": p.id,
                "portfolio_id": p.portfolio_id,
                "name": p.name,
                "type": p.type,
                "identifier": p.identifier,
                "image_url": p.image_url
            }
            for p in portfolio.people
        ],
        "widgets": [
            {
                "id": w.id,
                "portfolio_id": w.portfolio_id,
                "widget_id": w.widget_id,
                "widget_type": w.widget_type,
                "x": w.x,
                "y": w.y,
                "w": w.w,
                "h": w.h
            }
            for w in portfolio.widgets
        ]
    }
