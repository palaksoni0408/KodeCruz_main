from sqlalchemy.orm import Session
from typing import Optional
from app.users import models, schemas
from app.core.security import get_password_hash
from datetime import datetime

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email_or_username(db: Session, identifier: str):
    """Get user by email or username"""
    user = get_user_by_email(db, identifier)
    if not user:
        user = get_user_by_username(db, identifier)
    return user

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    
    # Use email as username if username not provided, and vice versa
    email = user.email or user.username
    username = user.username or user.email
    
    db_user = models.User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        auth_provider="local",
        is_verified=False # Local users need verification
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_oauth_user(db: Session, email: str, first_name: str, last_name: str, provider: str, provider_id: str):
    db_user = models.User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        auth_provider=provider,
        provider_id=provider_id,
        is_verified=True, # OAuth users are verified by provider
        hashed_password=None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_last_login(db: Session, user_id: str):
    user = get_user(db, user_id)
    if user:
        user.last_login = datetime.utcnow()
        db.commit()
