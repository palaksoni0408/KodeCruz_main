# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel and Render.

## ✅ Pre-Deployment

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] README.md updated with deployment instructions
- [ ] No sensitive data in repository
- [ ] `.gitignore` properly configured
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors
- [ ] Database initialized

## 🔧 Backend Deployment (Render)

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure web service settings:
  - [ ] Build command: `pip install -r requirements.txt`
  - [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - [ ] Environment: Python 3
- [ ] Add environment variables:
  - [ ] `OPENAI_API_KEY` (required)
  - [ ] `SECRET_KEY` (auto-generate or set)
  - [ ] `MODEL_NAME=gpt-4o-mini`
  - [ ] `DATABASE_URL=sqlite:///./kodescru.db`
  - [ ] `ALLOWED_ORIGINS=https://your-frontend.vercel.app` (update after frontend deployment)
  - [ ] `DEBUG=False`
  - [ ] `LOG_LEVEL=INFO`
- [ ] Deploy and wait for completion
- [ ] Copy backend URL (e.g., `https://your-backend.onrender.com`)
- [ ] Test backend health endpoint: `https://your-backend.onrender.com/health`
- [ ] Check API docs: `https://your-backend.onrender.com/docs`

## 🎨 Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure project settings:
  - [ ] Framework preset: Vite
  - [ ] Root directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Output directory: `dist`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL` set to `https://kodescruxx.onrender.com`
  - [ ] `VITE_WS_URL` set to `wss://kodescruxx.onrender.com`
  - [ ] `VITE_ASSET_BASE_URL=https://your-backend.onrender.com`
- [ ] Deploy and wait for completion
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)
- [ ] Test frontend loads correctly

## 🔄 Post-Deployment

- [ ] Update `ALLOWED_ORIGINS` in Render with Vercel URL
- [ ] Wait for Render automatic redeploy
- [ ] Test CORS by making API calls from frontend
- [ ] Test authentication (register/login)
- [ ] Test AI features (explain code, debug, etc.)
- [ ] Test collaborative rooms
- [ ] Test WebSocket connection
- [ ] Test voice chat (requires HTTPS)
- [ ] Test code execution
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## 📝 Optional Enhancements

- [ ] Set up custom domain on Vercel
- [ ] Set up custom domain on Render  
- [ ] Configure Render health checks
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline
- [ ] Enable auto-deploy from GitHub
- [ ] Add environment-specific configurations

## 🐛 Common Issues

**CORS Errors:**
- Ensure `ALLOWED_ORIGINS` in Render matches your Vercel URL exactly
- No trailing slashes in URLs
- Update after any domain changes

**WebSocket Connection Fails:**
- Use `wss://` (secure WebSocket) in production
- Check Render logs for WebSocket errors
- Free tier may have limitations

**Backend Slow to Respond:**
- Render free tier spins down after 15 minutes
- First request takes ~30 seconds (cold start)
- Consider paid tier for production

**Build Failures:**
- Check Vercel/Render build logs
- Verify all dependencies are listed
- Ensure correct Node.js/Python versions

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Project DEPLOYMENT.md](./DEPLOYMENT.md)
- [Project README.md](./README.md)

---

**After completing this checklist, your app should be live! 🎉**

Production URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`
