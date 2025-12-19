# System Audit & Security Analysis Report for KodesCruz

## 1. Executive Summary
The KodesCruz application is a modern, full-stack AI coding assistant built with **FastAPI (Backend)** and **React/Vite (Frontend)**. It features a robust set of AI-powered tools (Explain, Debug, Generate) and a collaborative coding environment.

**Critical Findings:**
- **High Risk**: The application uses **SQLite** for the database, which is **not suitable for production** on ephemeral cloud platforms like Render (data loss on restart) and lacks concurrency for high user loads.
- **Medium Risk**: Authentication tokens are stored in `localStorage`, exposing them to XSS attacks.
- **Technical Debt**: The codebase maintains "old" and "new" auth systems simultaneously, increasing complexity and potential bug surface.

## 2. Architecture Overview
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy (ORM), Pydantic.
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS.
- **Database**: SQLite (Current), PostgreSQL (Recommended).
- **Authentication**: Custom JWT (OAuth2 Password Flow), bcrypt hashing.
- **AI Engine**: OpenAI API integration with streaming responses.
- **Infrastructure**: Render (implied by `render.yaml`), Docker-ready.

---

## 3. Detailed Audit Findings

### 3.1 Non-Functional & Broken Components
| Component | Issue | Impact | Root Cause |
|-----------|-------|--------|------------|
| **Database Persistence** | Data loss on deployment/restart | **Critical**: User accounts and history vanish. | SQLite file usage on ephemeral file system (Render). |
| **Auth System** | Dual auth systems (Old vs New) | **Medium**: Confusing code maintenance. | Incomplete migration from legacy auth. |
| **Quota Tracking** | Relies on "Old" models | **Low**: Potential inconsistency. | `check_rate_limit` uses `old_models.UserActivity`. |

### 3.2 Frontend Issues
- **Token Storage**: JWT Access Tokens are stored in `localStorage` (`api.ts`).
    - *Risk*: Accessible via XSS.
    - *Fix*: Move to `HttpOnly` cookies.
- **Error Handling**: `QuotaExhaustedError` is well handled, but generic API errors often just throw "API request failed" without user-friendly messages.
- **Performance**: Large assets (images/videos) seem to be loaded directly. No evidence of image optimization or lazy loading strategies for the heavy "glassmorphism" UI assets.

### 3.3 Backend & API Issues
- **Database Concurrency**: SQLite locks the file on write. High traffic will cause `Database Locked` errors.
- **N+1 Queries**: The `check_rate_limit` dependency performs a DB query on **every** protected endpoint call. This will bottleneck performance at scale.
- **Error Responses**: Some endpoints return 500 Internal Server Error for expected failures (e.g., `execute_code` exceptions) instead of 400/422.

### 3.4 Security Vulnerabilities (Critical Section)

| Vulnerability | Severity | Attack Scenario | Fix |
|---------------|----------|-----------------|-----|
| **Insecure Token Storage** | **Medium** | Attacker injects JS (XSS) to steal `localStorage` tokens. | Store tokens in `HttpOnly`, `Secure` cookies. |
| **Missing CSRF Protection** | **Low** | If cookies were used without CSRF tokens, this would be High. | Implement CSRF middleware if moving to cookies. |
| **Default Secret Key** | **High** | `main.py` has a fallback default key. If env var fails, tokens are forgeable. | **Force** app crash if `SECRET_KEY` is missing. Remove default. |
| **Rate Limiting** | **Medium** | Rate limit is per-user (20/day). No IP-based throttling for login/signup (Brute Force risk). | Add IP-based rate limiting (e.g., `slowapi`). |
| **CORS Configuration** | **Low** | `ALLOWED_ORIGINS` defaults to localhost. | Ensure production env var is strictly set to the frontend domain. |

### 3.5 Performance & Scalability
- **Database**: SQLite is the primary bottleneck. Max concurrent users ~10-50 before significant locking issues.
- **AI Streaming**: Implemented correctly using Server-Sent Events (SSE), which is excellent for perceived performance.
- **Asset Delivery**: No CDN configured. Static assets served by backend or frontend server directly.

### 3.6 Infrastructure & Deployment Risks
- **Data Persistence**: As noted, SQLite on Render is a critical failure point.
- **Secrets**: `OPENAI_API_KEY` and `SECRET_KEY` are correctly expected from env vars, but the fallback in code is risky.
- **Logging**: `logger.info` is used. Ensure sensitive data (PII, tokens) is never logged.

### 3.7 Payment Integration Feasibility
- **Current State**: No payment infrastructure.
- **Feasibility**: **High**. The backend is structured well enough to add a `Payment` model and endpoints.
- **Recommendation**:
    1.  Integrate **Stripe** or **Razorpay**.
    2.  Create `Subscription` table linked to `User`.
    3.  Update `check_rate_limit` to check subscription status instead of just fixed count.

### 3.8 Data Protection & Legal Compliance
- **GDPR/DPDP**:
    - No "Delete Account" feature visible in API.
    - No Privacy Policy or Terms of Service acceptance tracking.
    - Data is stored in US (likely, via Render/OpenAI). Needs disclosure for EU/Indian users.

---

## 4. Risk Scores

- **Security Risk Score**: **6/10** (Due to SQLite, Token Storage, Default Secrets)
- **Stability Score**: **4/10** (Critical DB persistence issue)
- **Scalability Score**: **3/10** (SQLite limits this severely)
- **Monetization Readiness Score**: **2/10** (No payments, quota system is basic)

---

## 5. Final Recommendations & Action Plan

### Phase 1: Immediate Fixes (Production Readiness)
1.  **Migrate to PostgreSQL**: Replace SQLite with PostgreSQL (e.g., Render Managed Postgres or Supabase).
2.  **Secure Secrets**: Remove default `SECRET_KEY` fallback. Make the app fail to start if keys are missing.
3.  **Fix Auth Storage**: Move from `localStorage` to `HttpOnly` cookies.

### Phase 2: Short-Term Improvements
1.  **Unified Auth**: Remove legacy auth code and fully switch to the new system.
2.  **Rate Limiting**: Add IP-based rate limiting for `/auth/login` and `/auth/signup`.
3.  **Error Handling**: Standardize API error responses.

### Phase 3: Long-Term & Features
1.  **Payment Integration**: Implement Stripe/Razorpay for premium quotas.
2.  **CDN**: Serve static assets (images, JS) via a CDN (Cloudflare/AWS CloudFront).
3.  **Testing**: Add comprehensive unit and integration tests (currently minimal).
