# KodesCruz Backend Authentication System

This is a production-ready FastAPI backend with secure authentication, OAuth integration (Google, GitHub), and a modular architecture.

## 🚀 Features

- **Secure Auth**: JWT Access & Refresh Tokens, Bcrypt password hashing.
- **OAuth 2.0**: Google and GitHub login integration.
- **Database**: SQLAlchemy ORM with PostgreSQL support (defaulting to SQLite for local dev).
- **Modular Design**: Clean `app/` directory structure separating concerns.

## 🛠️ Setup Instructions

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    PROJECT_NAME=KodesCruz
    SECRET_KEY=your-super-secret-key-change-this-in-prod
    ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
    
    # Database (Uncomment for PostgreSQL)
    # DATABASE_URL=postgresql://user:password@localhost/dbname
    
    # Google OAuth
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    
    # GitHub OAuth
    GITHUB_CLIENT_ID=your-github-client-id
    GITHUB_CLIENT_SECRET=your-github-client-secret
    ```

3.  **Run the Server**:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

## 📡 API Endpoints

### Authentication

-   **POST /auth/signup**
    -   **Body**: `{"email": "user@example.com", "password": "securePass123", "first_name": "John", "last_name": "Doe"}`
    -   **Response**: `{"access_token": "...", "refresh_token": "...", "token_type": "bearer"}`

-   **POST /auth/login**
    -   **Body**: `username` (email) and `password` (form-data)
    -   **Response**: `{"access_token": "...", "refresh_token": "...", "token_type": "bearer"}`

-   **GET /auth/google/login** & **GET /auth/github/login**
    -   Initiates OAuth flow.

## 💻 Frontend Integration Notes

### Signup/Login
1.  Call `/auth/signup` or `/auth/login`.
2.  Store `access_token` in memory (or short-lived storage).
3.  `refresh_token` is set as an HTTPOnly cookie automatically by the backend for security.

### OAuth Buttons
1.  **Google Button**: Link to `http://localhost:8000/auth/google/login`.
2.  **GitHub Button**: Link to `http://localhost:8000/auth/github/login`.
3.  The backend will handle the callback and return the tokens (or redirect to a frontend route with tokens).

### Protected Routes
Include the header in your requests:
```javascript
headers: {
  "Authorization": `Bearer ${accessToken}`
}
```
