from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.users import repository as user_repo
from app.core import security
from app.core.config import settings

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user by email or username"""
    # Try to find user by email or username
    user = user_repo.get_user_by_email_or_username(db, email)
    if not user:
        return False
    if not user.hashed_password: # OAuth users might not have password
        return False
    if not security.verify_password(password, user.hashed_password):
        return False
    return user

def create_tokens(user_id: str) -> tuple[str, str]:
    access_token = security.create_access_token(data={"sub": user_id, "type": "access"})
    refresh_token = security.create_access_token(
        data={"sub": user_id, "type": "refresh"},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    return access_token, refresh_token
