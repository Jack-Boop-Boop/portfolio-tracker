from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    data_sources = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    people = relationship("PortfolioPerson", back_populates="portfolio", cascade="all, delete-orphan")
    widgets = relationship("WidgetLayout", back_populates="portfolio", cascade="all, delete-orphan")


class PortfolioPerson(Base):
    __tablename__ = "portfolio_people"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # 'politician' or 'hedge_fund'
    identifier = Column(String(255), nullable=True)  # For API lookups
    image_url = Column(String(500), nullable=True)

    portfolio = relationship("Portfolio", back_populates="people")


class WidgetLayout(Base):
    __tablename__ = "widget_layouts"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    widget_id = Column(String(50), nullable=False)  # Unique identifier for frontend
    widget_type = Column(String(50), nullable=False)
    x = Column(Integer, default=0)
    y = Column(Integer, default=0)
    w = Column(Integer, default=4)
    h = Column(Integer, default=3)

    portfolio = relationship("Portfolio", back_populates="widgets")
