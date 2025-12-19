"""
Stack Auth Integration Endpoint
Creates a backend user for Stack Auth authenticated users and returns a JWT token
"""
from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.users import models as user_models
from jose import jwt

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/sync-stack-user")
def sync_stack_user(
    authorization: str = Header(..., description="Bearer <token>"),
    db: Session = Depends(get_db)
):
    """
    Sync Neon Auth user into local DB.
    Decodes the Neon JWT (RS256) directly to get user info.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication header")
    
    token = authorization.split(" ")[1]
    
    try:
        # Decode token without verification (Neon uses RS256, we don't have the public key set up yet)
        # TODO: Implement proper RS256 verification with Neon's JWKS
        payload = jwt.get_unverified_claims(token)
        
        # Extract user info from Neon token
        # Neon/Stack Auth tokens usually have 'sub' as user ID, and 'email'
        user_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("name", "")
        
        if not user_id or not email:
            raise HTTPException(status_code=400, detail="Invalid token payload: missing sub or email")

        # Check if user exists
        db_user = db.query(user_models.User).filter(
            user_models.User.id == user_id
        ).first()

        if not db_user:
            # Create new user
            # Handle name splitting
            name_parts = name.split(" ", 1)
            first_name = name_parts[0] if name_parts else ""
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            db_user = user_models.User(
                id=user_id,
                email=email,
                username=email.split("@")[0], # Fallback username
                first_name=first_name,
                last_name=last_name,
                hashed_password=None
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        return {"success": True, "user_id": db_user.id}

    except Exception as e:
        print(f"Sync error: {str(e)}") # Log error for debugging
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync user: {str(e)}"
        )
