from typing import Optional
from pydantic import BaseModel, EmailStr, model_validator
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    @model_validator(mode='after')
    def check_email_or_username(self):
        # At least one of email or username must be provided
        if self.email is None and self.username is None:
            raise ValueError('Either email or username must be provided')
        return self

class UserCreate(UserBase):
    password: str
    email: Optional[EmailStr] = None  # Make email optional
    username: Optional[str] = None    # Username is optional too

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    email: Optional[str] = None
    username: Optional[str] = None
    is_active: bool
    is_verified: bool
    auth_provider: str
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str
