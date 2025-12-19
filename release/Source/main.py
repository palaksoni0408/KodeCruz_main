from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import Optional
import logging
import json
import os
from pathlib import Path
from datetime import timedelta
from sqlalchemy.orm import Session

import models
from models import User
from database import get_db

from auth import get_current_user, create_access_token, verify_password, get_password_hash

from ai_engine import (
    explain_code,
    debug_code,
    generate_code,
    convert_logic_to_code,
    analyze_complexity,
    trace_code,
    get_snippets,
    get_projects,
    get_roadmaps,
    check_llm_health,
    stream_explain_code,
    stream_debug_code,
    stream_generate_code,
    stream_convert_logic,
    stream_analyze_complexity,
    stream_trace_code,
    stream_get_snippets,
    stream_get_projects,
    stream_get_roadmaps,
    # New AI Developer Features
    review_code,
    stream_review_code,
    generate_tests,
    stream_generate_tests,
    refactor_code,
    stream_refactor_code
)
from code_executor import executor, SUPPORTED_LANGUAGES
from websocket_handler import connection_manager
from room_manager import room_manager
from database import get_db
import models
import auth

logger = logging.getLogger(__name__)

app = FastAPI()

# Get allowed origins from environment variable or use defaults (needed before CORS middleware)
ALLOWED_ORIGINS_STR = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)
# Clean up origins: remove whitespace and filter empty strings
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_STR.split(",") if origin.strip()]

# Log allowed origins for debugging (don't log in production)
if os.getenv("DEBUG", "False").lower() == "true":
    logger.info(f"Allowed CORS origins: {ALLOWED_ORIGINS}")

# Add CORS middleware (must be before static files)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Serve static images if directory exists
BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "images"

if IMAGES_DIR.exists():
    app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

class RequestModel(BaseModel):
    language: str = None
    code: str = None
    topic: str = None
    level: str = None
    logic: str = None
    snippet: str = None
    snippet_name: str = None
    project_topic: str = None
    roadmap_topic: str = None
    framework: str = None  # For test generation
    refactor_type: str = None  # For code refactoring

class ExecuteCodeRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code to execute")
    language: str = Field(..., min_length=1, description="Programming language")
    stdin: Optional[str] = Field(default="", description="Standard input")
    version: Optional[str] = Field(default="*", description="Language version")

class ExecuteCodeResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    language: str
    stage: Optional[str] = None
    exit_code: Optional[int] = None
    version: Optional[str] = None

class CreateRoomRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Room name")
    host_name: str = Field(..., min_length=1, description="Host name")
    language: str = Field(default="Python", description="Programming language")
    code: str = Field(default="", description="Initial code")
    max_users: int = Field(default=10, ge=2, le=50, description="Maximum users")
    is_public: bool = Field(default=True, description="Public room")

class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

class LogActivityRequest(BaseModel):
    feature: str
    language: Optional[str] = None
    success: bool = True
    duration_ms: Optional[int] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    
    class Config:
        orm_mode = True

# Auth Endpoints
@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if user.email:
        db_email = db.query(models.User).filter(models.User.email == user.email).first()
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        id=room_manager.generate_user_id(),
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/explain")
def explain(req: RequestModel):
    return {"response": explain_code(req.language, req.topic or "", req.level, req.code or "")}

@app.post("/debug")
def debug(req: RequestModel):
    return {"response": debug_code(req.language, req.code, req.topic or "")}

@app.post("/generate")
def generate(req: RequestModel):
    return {"response": generate_code(req.language, req.topic, req.level)}

@app.post("/convert_logic")
def convert_logic(req: RequestModel):
    return {"response": convert_logic_to_code(req.logic, req.language)}

@app.post("/analyze_complexity")
def analyze(req: RequestModel):
    return {"response": analyze_complexity(req.code)}

@app.post("/get_snippets")
def get_snippets_endpoint(req: RequestModel):
    return {"response": get_snippets(req.language, req.snippet or req.topic or "")}

@app.post("/get_projects")
def get_projects_endpoint(req: RequestModel):
    return {"response": get_projects(req.level, req.topic)}

@app.post("/get_roadmaps")
def get_roadmaps_endpoint(req: RequestModel):
    return {"response": get_roadmaps(req.level, req.topic)}

@app.post("/trace_code")
def trace_code_endpoint(req: RequestModel):
    return {"response": trace_code(req.code or "", req.language or "python")}

# ============================================
# NEW AI DEVELOPER FEATURES
# ============================================

@app.post("/review_code")
def review_code_endpoint(req: RequestModel):
    """Comprehensive code review"""
    return {"response": review_code(req.code or "", req.language or "python")}

@app.post("/generate_tests")
def generate_tests_endpoint(req: RequestModel):
    """Generate unit tests for code"""
    framework = getattr(req, 'framework', '')
    return {"response": generate_tests(req.code or "", req.language or "python", framework)}

@app.post("/refactor_code")
def refactor_code_endpoint(req: RequestModel):
    """Refactor code with improvements"""
    refactor_type = getattr(req, 'refactor_type', 'general')
    return {"response": refactor_code(req.code or "", req.language or "python", refactor_type)}


# Streaming endpoints
@app.post("/stream/explain")
async def stream_explain_endpoint(req: RequestModel):
    """Stream explanation of code or topic"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_explain_code(req.language, req.topic or "", req.level, req.code or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/debug")
async def stream_debug_endpoint(req: RequestModel):
    """Stream debugging analysis"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_debug_code(req.language, req.code or "", req.topic or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/generate")
async def stream_generate_endpoint(req: RequestModel):
    """Stream code generation"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_generate_code(req.language, req.topic or "", req.level or "Beginner"):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/convert_logic")
async def stream_convert_logic_endpoint(req: RequestModel):
    """Stream logic to code conversion"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_convert_logic(req.logic or "", req.language):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/analyze_complexity")
async def stream_analyze_complexity_endpoint(req: RequestModel):
    """Stream complexity analysis"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_analyze_complexity(req.code or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/trace_code")
async def stream_trace_code_endpoint(req: RequestModel):
    """Stream code tracing"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_trace_code(req.code or "", req.language or "python"):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/get_snippets")
async def stream_get_snippets_endpoint(req: RequestModel):
    """Stream code snippets"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_get_snippets(req.language, req.snippet or req.topic or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/get_projects")
async def stream_get_projects_endpoint(req: RequestModel):
    """Stream project ideas"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_get_projects(req.level or "Beginner", req.topic or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/get_roadmaps")
async def stream_get_roadmaps_endpoint(req: RequestModel):
    """Stream learning roadmaps"""
    async def generate():
        # Send immediate response to show request was received
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_get_roadmaps(req.level or "Beginner", req.topic or ""):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")


@app.post("/stream/review_code")
async def stream_review_code_endpoint(req: RequestModel):
    """Stream code review analysis"""
    async def generate():
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        async for chunk in stream_review_code(req.code or "", req.language or "python"):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/generate_tests")
async def stream_generate_tests_endpoint(req: RequestModel):
    """Stream test generation"""
    async def generate():
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        framework = getattr(req, 'framework', '')
        async for chunk in stream_generate_tests(req.code or "", req.language or "python", framework):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/stream/refactor_code")
async def stream_refactor_code_endpoint(req: RequestModel):
    """Stream code refactoring"""
    async def generate():
        yield f"data: {json.dumps({'chunk': ''})}\n\n"
        refactor_type = getattr(req, 'refactor_type', 'general')
        async for chunk in stream_refactor_code(req.code or "", req.language or "python", refactor_type):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/health")
def health():
    """Health check endpoint - also used to wake up backend from cold start"""
    health_status = check_llm_health()
    return {"status": "ok", "llm": health_status}

@app.get("/wake")
def wake():
    """Lightweight wake-up endpoint to prevent cold starts - faster than /health"""
    return {"status": "awake", "message": "Backend is ready"}

@app.post("/execute_code", response_model=ExecuteCodeResponse)
async def execute_code_endpoint(request: ExecuteCodeRequest):
    """
    Execute code in various programming languages
    
    Supported languages: Python, JavaScript, Java, C++, C, C#, Ruby, Go, Rust, PHP, etc.
    """
    try:
        logger.info(f"Execute code request: {request.language}")
        result = await executor.execute_code(
            code=request.code,
            language=request.language,
            stdin=request.stdin,
            version=request.version
        )
        return ExecuteCodeResponse(**result)
    except Exception as e:
        logger.error(f"Execute code error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/supported_languages")
async def get_supported_languages():
    """Get list of supported programming languages"""
    return {
        "languages": list(SUPPORTED_LANGUAGES.keys()),
        "count": len(SUPPORTED_LANGUAGES)
    }

@app.get("/runtimes")
async def get_runtimes():
    """Get detailed runtime information for all languages"""
    try:
        runtimes = await executor.get_runtimes()
        return {
            "runtimes": runtimes,
            "count": len(runtimes)
        }
    except Exception as e:
        logger.error(f"Failed to get runtimes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint for collaborative rooms
@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    """
    WebSocket endpoint for real-time collaborative coding
    
    Message types:
    - join: Join a room (requires room_id, user_name)
    - leave: Leave the current room
    - code_change: Broadcast code changes (requires room_id, code)
    - cursor_move: Broadcast cursor position (requires room_id, position)
    - language_change: Change programming language (requires room_id, language)
    - chat_message: Send chat message (requires room_id, message)
    - execute_code: Broadcast code execution result (requires room_id, result)
    - voice_audio: Broadcast voice audio data (requires room_id, audio_data)
    """
    await connection_manager.connect(websocket)
    
    try:
        while True:
            # Receive message from client - can be text or binary (for audio)
            try:
                # Try to receive as text first
                data = await websocket.receive_text()
                
                try:
                    message = json.loads(data)
                    message["room_id"] = room_id  # Ensure room_id is set
                    await connection_manager.handle_message(websocket, message)
                except json.JSONDecodeError:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid JSON format"
                    })
                except Exception as e:
                    logger.error(f"Error handling message: {e}")
                    await websocket.send_json({
                        "type": "error",
                        "message": str(e)
                    })
            except Exception as e:
                # If text receive fails, try binary (for future audio streaming)
                try:
                    data = await websocket.receive_bytes()
                    # For now, we handle audio via base64 in JSON messages
                    # This can be extended for binary audio streaming
                    logger.debug(f"Received binary data: {len(data)} bytes")
                except Exception as binary_err:
                    logger.error(f"Error receiving message: {e}, binary: {binary_err}")
                    break
    
    except WebSocketDisconnect:
        # Handle user leaving
        await connection_manager.handle_leave(websocket)
        logger.info(f"WebSocket disconnected for room {room_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await connection_manager.handle_leave(websocket)

# REST endpoints for room management
@app.post("/rooms/create")
async def create_room(request: CreateRoomRequest):
    """Create a new collaborative room"""
    try:
        room = room_manager.create_room(
            name=request.name,
            host_name=request.host_name,
            language=request.language,
            code=request.code,
            max_users=request.max_users,
            is_public=request.is_public
        )
        return {
            "success": True,
            "room": room
        }
    except Exception as e:
        logger.error(f"Error creating room: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/rooms/{room_id}")
async def get_room(room_id: str):
    """Get room information"""
    room = room_manager.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {
        "success": True,
        "room": room
    }

@app.get("/rooms")
async def list_rooms():
    """List all public rooms"""
    try:
        rooms = room_manager.get_public_rooms()
        return {
            "success": True,
            "rooms": rooms,
            "count": len(rooms)
        }
    except Exception as e:
        logger.error(f"Error listing rooms: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/rooms/{room_id}/chat")
async def get_room_chat(room_id: str):
    """Get chat history for a room"""
    try:
        messages = room_manager.get_chat_history(room_id)
        return {
            "success": True,
            "messages": messages
        }
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/rooms/{room_id}")
async def delete_room(room_id: str):
    """Delete a room (only if empty or by host)"""
    room = room_manager.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Only allow deletion if room is empty
    if room.get('user_count', 0) > 0:
        raise HTTPException(status_code=403, detail="Cannot delete room with active users")
    
    success = room_manager.delete_room(room_id)
    if success:
        return {"success": True, "message": "Room deleted"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete room")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    await executor.close()
    logger.info("Application shutdown complete")

# Dashboard Endpoints
@app.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user dashboard statistics"""
    from sqlalchemy import func
    
    # Total activities count
    total_uses = db.query(models.UserActivity).filter(
        models.UserActivity.user_id == current_user.id
    ).count()
    
    # Unique features used
    features_used = db.query(func.count(func.distinct(models.UserActivity.feature))).filter(
        models.UserActivity.user_id == current_user.id
    ).scalar() or 0
    
    # Success rate
    total_activities = db.query(models.UserActivity).filter(
        models.UserActivity.user_id == current_user.id
    ).count()
    
    successful = db.query(models.UserActivity).filter(
        models.UserActivity.user_id == current_user.id,
        models.UserActivity.success == True
    ).count()
    
    success_rate = (successful / total_activities * 100) if total_activities > 0 else 100
    
    # Average duration
    avg_duration = db.query(func.avg(models.UserActivity.duration_ms)).filter(
        models.UserActivity.user_id == current_user.id,
        models.UserActivity.duration_ms.isnot(None)
    ).scalar() or 0
    
    return {
        "total_uses": total_uses,
        "features_used": features_used,
        "success_rate": round(success_rate, 1),
        "avg_duration_ms": round(avg_duration, 0) if avg_duration else 0
    }

@app.get("/dashboard/recent")
async def get_recent_activity(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent user activity"""
    activities = db.query(models.UserActivity).filter(
        models.UserActivity.user_id == current_user.id
    ).order_by(models.UserActivity.timestamp.desc()).limit(limit).all()
    
    return {
        "activities": [
            {
                "id": activity.id,
                "feature": activity.feature,
                "language": activity.language,
                "success": activity.success,
                "timestamp": activity.timestamp.isoformat(),
                "duration_ms": activity.duration_ms
            }
            for activity in activities
        ]
    }

@app.post("/activity/log")
async def log_activity(
    activity_data: LogActivityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Log user activity"""
    import uuid
    
    activity = models.UserActivity(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        feature=activity_data.feature,
        language=activity_data.language,
        success=activity_data.success,
        duration_ms=activity_data.duration_ms
    )
    
    db.add(activity)
    db.commit()
    
    return {"status": "logged"}

# Workflow Endpoints

@app.post("/workflows")
async def create_workflow(
    name: str,
    nodes: str,
    edges: str,
    description: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    import uuid
    workflow = models.Workflow(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=name,
        description=description,
        nodes=nodes,
        edges=edges
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow

@app.get("/workflows")
async def get_workflows(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Workflow).filter(models.Workflow.user_id == current_user.id).all()

@app.get("/workflows/{workflow_id}")
async def get_workflow(workflow_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow

@app.post("/workflows/{workflow_id}/run")
async def run_workflow(
    workflow_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    import uuid
    from workflow_engine import WorkflowEngine
    
    workflow = db.query(models.Workflow).filter(
        models.Workflow.id == workflow_id,
        models.Workflow.user_id == current_user.id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    execution_id = str(uuid.uuid4())
    execution = models.WorkflowExecution(
        id=execution_id,
        workflow_id=workflow.id,
        status="pending"
    )
    db.add(execution)
    db.commit()
    
    engine = WorkflowEngine(db)
    background_tasks.add_task(engine.execute_workflow, execution_id)
    
    return {"execution_id": execution_id, "status": "pending"}

@app.get("/workflows/executions/{execution_id}")
async def get_execution(execution_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    execution = db.query(models.WorkflowExecution).join(models.Workflow).filter(
        models.WorkflowExecution.id == execution_id,
        models.Workflow.user_id == current_user.id
    ).first()
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return {
        "id": execution.id,
        "status": execution.status,
        "results": execution.results,
        "started_at": execution.started_at,
        "completed_at": execution.completed_at,
        "error": execution.error
    }

