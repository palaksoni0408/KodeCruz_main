from sqlalchemy.orm import Session
from database import SessionLocal
import models
import auth
import sys

def reset_password(username, new_password):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user:
            print(f"User '{username}' not found.")
            return

        hashed_password = auth.get_password_hash(new_password)
        user.hashed_password = hashed_password
        db.commit()
        print(f"Password for user '{username}' has been successfully reset.")
    except Exception as e:
        print(f"Error resetting password: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python reset_password.py <username> <new_password>")
    else:
        reset_password(sys.argv[1], sys.argv[2])
