"""
Collaborative Room Manager for KodesCRUxxx
Manages real-time collaborative coding sessions with database persistence
"""

import asyncio
import json
import logging
from typing import Dict, List, Set, Optional
from datetime import datetime
from dataclasses import dataclass, asdict
from collections import defaultdict
import uuid
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

logger = logging.getLogger(__name__)


@dataclass
class User:
    """User in a collaborative room (Ephemeral state)"""
    id: str
    name: str
    color: str  # Hex color for cursor
    is_host: bool = False
    joined_at: str = None
    
    def __post_init__(self):
        if self.joined_at is None:
            self.joined_at = datetime.utcnow().isoformat()
    
    def to_dict(self):
        return asdict(self)


@dataclass
class RoomState:
    """In-memory state for a room"""
    users: Dict[str, User] = None
    
    def __post_init__(self):
        if self.users is None:
            self.users = {}


class RoomManager:
    """Manages collaborative rooms and WebSocket connections"""
    
    def __init__(self):
        # Active connections: room_id -> set of websocket connections
        self.connections: Dict[str, Set] = defaultdict(set)
        
        # In-memory room state (users, cursors)
        # room_id -> RoomState
        self.active_rooms: Dict[str, RoomState] = {}
        
        # User to room mapping: user_id -> room_id
        self.user_rooms: Dict[str, str] = {}
        
        # WebSocket to user mapping: websocket -> user_id
        self.ws_users: Dict = {}
        
        # User colors (for cursor display)
        self.user_colors = [
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
            "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
            "#F8B739", "#52B788", "#E76F51", "#2A9D8F"
        ]
        self.color_index = 0
    
    def get_db(self):
        return SessionLocal()
    
    def generate_room_id(self) -> str:
        """Generate unique room ID"""
        return str(uuid.uuid4())[:8]
    
    def generate_user_id(self) -> str:
        """Generate unique user ID"""
        return str(uuid.uuid4())
    
    def get_user_color(self) -> str:
        """Get next available color for user cursor"""
        color = self.user_colors[self.color_index % len(self.user_colors)]
        self.color_index += 1
        return color
    
    def create_room(
        self,
        name: str,
        host_name: str,
        language: str = "Python",
        code: str = "",
        max_users: int = 10,
        is_public: bool = True
    ) -> dict:
        """Create a new collaborative room and save to DB"""
        db = self.get_db()
        try:
            room_id = self.generate_room_id()
            host_id = self.generate_user_id()
            
            # Create host user in DB (if we had full auth, we'd use existing user)
            # For now, we just store the room
            
            db_room = models.Room(
                id=room_id,
                name=name,
                host_id=host_id,
                language=language,
                code=code,
                max_users=max_users,
                is_public=is_public,
                created_at=datetime.utcnow()
            )
            db.add(db_room)
            db.commit()
            db.refresh(db_room)
            
            # Initialize in-memory state
            host = User(
                id=host_id,
                name=host_name,
                color=self.get_user_color(),
                is_host=True
            )
            
            self.active_rooms[room_id] = RoomState(users={host_id: host})
            logger.info(f"Created room {room_id}: {name}")
            
            return self._room_to_dict(db_room, self.active_rooms[room_id])
        finally:
            db.close()
    
    def get_room(self, room_id: str) -> Optional[dict]:
        """Get room by ID (from DB + Memory)"""
        db = self.get_db()
        try:
            db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
            if not db_room:
                return None
            
            # Get or create in-memory state
            if room_id not in self.active_rooms:
                self.active_rooms[room_id] = RoomState()
                
            return self._room_to_dict(db_room, self.active_rooms[room_id])
        finally:
            db.close()
            
    def _room_to_dict(self, db_room: models.Room, room_state: RoomState) -> dict:
        """Combine DB data and in-memory state"""
        return {
            "id": db_room.id,
            "name": db_room.name,
            "host_id": db_room.host_id,
            "language": db_room.language,
            "code": db_room.code,
            "created_at": db_room.created_at.isoformat(),
            "max_users": db_room.max_users,
            "is_public": db_room.is_public,
            "users": [user.to_dict() for user in room_state.users.values()],
            "user_count": len(room_state.users)
        }
    
    def delete_room(self, room_id: str) -> bool:
        """Delete a room from DB and memory"""
        db = self.get_db()
        try:
            # Remove from DB
            db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
            if db_room:
                db.delete(db_room)
                db.commit()
            
            # Remove from memory
            if room_id in self.active_rooms:
                # Cleanup users
                for user_id in list(self.active_rooms[room_id].users.keys()):
                    self.user_rooms.pop(user_id, None)
                del self.active_rooms[room_id]
            
            self.connections.pop(room_id, None)
            logger.info(f"Deleted room {room_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting room: {e}")
            return False
        finally:
            db.close()
    
    def join_room(self, room_id: str, user_name: str, websocket) -> Optional[User]:
        """User joins a room"""
        room_data = self.get_room(room_id)
        if not room_data:
            logger.warning(f"Room {room_id} does not exist")
            return None
        
        room_state = self.active_rooms[room_id]
        
        # Check if room is full
        if len(room_state.users) >= room_data['max_users']:
            logger.warning(f"Room {room_id} is full")
            return None
        
        # Check if this websocket is already connected
        existing_user_id = self.ws_users.get(websocket)
        if existing_user_id and existing_user_id in room_state.users:
            user = room_state.users[existing_user_id]
            self.connections[room_id].add(websocket)
            return user
        
        # Check if host is joining
        # Note: In a real auth system, we'd verify the user ID. 
        # Here we just check if the name matches the original host name is tricky without auth.
        # For now, we'll assume new users are guests unless they have the host_id cookie (not implemented yet).
        # Simplified: First user is host (handled in create), others are guests.
        # If the room exists in DB but memory is empty, the first joiner isn't necessarily the host 
        # unless we have auth. For this MVP, we'll just create a new user.
        
        user_id = self.generate_user_id()
        is_host = False
        
        # If memory was empty but DB exists, check if this user matches stored host_id? 
        # We can't verify identity without auth. 
        # So we'll just add them as a participant.
        
        user = User(
            id=user_id,
            name=user_name,
            color=self.get_user_color(),
            is_host=is_host
        )
        
        room_state.users[user_id] = user
        self.user_rooms[user_id] = room_id
        
        self.connections[room_id].add(websocket)
        self.ws_users[websocket] = user_id
        
        logger.info(f"User {user_name} ({user_id}) joined room {room_id}")
        return user
    
    def leave_room(self, websocket) -> Optional[tuple]:
        """User leaves a room"""
        user_id = self.ws_users.get(websocket)
        if not user_id:
            return None
        
        room_id = self.user_rooms.get(user_id)
        if not room_id:
            return None
        
        if room_id in self.active_rooms:
            room_state = self.active_rooms[room_id]
            user = room_state.users.pop(user_id, None)
            self.user_rooms.pop(user_id, None)
            self.connections[room_id].discard(websocket)
            self.ws_users.pop(websocket, None)
            
            # If room is empty in memory, we DON'T delete from DB immediately
            # This allows persistence.
            if len(room_state.users) == 0:
                del self.active_rooms[room_id]
            
            logger.info(f"User {user_id} left room {room_id}")
            return (room_id, user)
        return None
    
    def update_code(self, room_id: str, code: str) -> bool:
        """Update room code in DB"""
        db = self.get_db()
        try:
            db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
            if db_room:
                db_room.code = code
                db.commit()
                return True
            return False
        finally:
            db.close()
    
    def update_language(self, room_id: str, language: str) -> bool:
        """Update room language in DB"""
        db = self.get_db()
        try:
            db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
            if db_room:
                db_room.language = language
                db.commit()
                return True
            return False
        finally:
            db.close()
    
    def get_room_users(self, room_id: str) -> List[User]:
        """Get all users in a room"""
        if room_id in self.active_rooms:
            return list(self.active_rooms[room_id].users.values())
        return []
    
    def get_connections(self, room_id: str) -> Set:
        """Get all WebSocket connections for a room"""
        return self.connections.get(room_id, set())
    
    def get_public_rooms(self) -> List[Dict]:
        """Get all public rooms from DB"""
        db = self.get_db()
        try:
            db_rooms = db.query(models.Room).filter(models.Room.is_public == True).all()
            # For public listing, we might not need full user details, just counts
            rooms_list = []
            for db_room in db_rooms:
                user_count = 0
                if db_room.id in self.active_rooms:
                    user_count = len(self.active_rooms[db_room.id].users)
                
                rooms_list.append({
                    "id": db_room.id,
                    "name": db_room.name,
                    "language": db_room.language,
                    "user_count": user_count,
                    "max_users": db_room.max_users,
                    "created_at": db_room.created_at.isoformat()
                })
            return rooms_list
        finally:
            db.close()
    
    async def broadcast_to_room(self, room_id: str, message: dict, exclude_ws=None):
        """Broadcast message to all users in a room"""
        connections = self.get_connections(room_id)
        
        disconnected = set()
        for ws in connections:
            if ws == exclude_ws:
                continue
            
            try:
                await ws.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to websocket: {e}")
                disconnected.add(ws)
        
        # Clean up disconnected websockets
        for ws in disconnected:
            self.leave_room(ws)

    def save_chat_message(self, room_id: str, username: str, message: str, user_id: str = None) -> Optional[dict]:
        """Save chat message to DB"""
        db = self.get_db()
        try:
            msg_id = str(uuid.uuid4())
            db_msg = models.ChatMessage(
                id=msg_id,
                room_id=room_id,
                user_id=user_id,
                username=username,
                message=message,
                timestamp=datetime.utcnow()
            )
            db.add(db_msg)
            db.commit()
            db.refresh(db_msg)
            
            return {
                "id": db_msg.id,
                "room_id": db_msg.room_id,
                "username": db_msg.username,
                "message": db_msg.message,
                "timestamp": db_msg.timestamp.isoformat()
            }
        except Exception as e:
            logger.error(f"Error saving chat message: {e}")
            return None
        finally:
            db.close()

    def get_chat_history(self, room_id: str, limit: int = 50) -> List[dict]:
        """Get chat history for a room"""
        db = self.get_db()
        try:
            messages = db.query(models.ChatMessage)\
                .filter(models.ChatMessage.room_id == room_id)\
                .order_by(models.ChatMessage.timestamp.asc())\
                .limit(limit)\
                .all()
            
            return [{
                "id": msg.id,
                "room_id": msg.room_id,
                "username": msg.username,
                "message": msg.message,
                "timestamp": msg.timestamp.isoformat()
            } for msg in messages]
        finally:
            db.close()


# Global room manager instance
room_manager = RoomManager()