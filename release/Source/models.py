from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    rooms_hosted = relationship("Room", back_populates="host")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    host_id = Column(String, ForeignKey("users.id"))
    language = Column(String, default="Python")
    code = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    max_users = Column(Integer, default=10)
    is_public = Column(Boolean, default=True)
    
    # Relationships
    # Relationships
    host = relationship("User", back_populates="rooms_hosted")
    messages = relationship("ChatMessage", back_populates="room", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    room_id = Column(String, ForeignKey("rooms.id"))
    user_id = Column(String, nullable=True)  # Optional link to registered user
    username = Column(String)  # Display name at time of message
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    room = relationship("Room", back_populates="messages")

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    feature = Column(String)  # e.g., 'review', 'tests', 'refactor'
    language = Column(String, nullable=True)
    success = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    duration_ms = Column(Integer, nullable=True)  # Time taken for operation
    
    # Relationships
    user = relationship("User")

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    description = Column(String, nullable=True)
    nodes = Column(String)  # JSON string of nodes
    edges = Column(String)  # JSON string of edges
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User")
    executions = relationship("WorkflowExecution", back_populates="workflow")

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"

    id = Column(String, primary_key=True, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"))
    status = Column(String)  # 'pending', 'running', 'completed', 'failed'
    results = Column(String)  # JSON string of results
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error = Column(String, nullable=True)

    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
