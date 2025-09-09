# Deployment Guide

## Vercel (Frontend) Deployment

### 1. Prepare Frontend for Vercel

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Select the `frontend` folder as the root directory

3. **Environment Variables in Vercel:**
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Deploy:**
   - Vercel will automatically detect Next.js
   - Click "Deploy"

### 2. Vercel Configuration

The `vercel.json` file is already configured with:
- PDF.js worker compatibility
- API rewrites to backend
- Security headers
- Build optimization

---

## Render (Backend) Deployment

### 1. Prepare Backend for Render

1. **Push your code to GitHub** (if not already done)
2. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub

3. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Configure:
     - **Name:** `pdf-invoice-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`

### 2. Environment Variables in Render

Add these in Render dashboard → Environment:

```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://mowazzemahmed19_db_user:rony@cluster0.e9dwh8g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=AIzaSyAl8PU3Bh4t1BMWBZ7A24UyQXYovAG1ZHQ
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
MAX_FILE_SIZE=26214400
UPLOAD_DIR=uploads
```

### 3. Deploy Backend

- Click "Deploy Web Service"
- Render will build and deploy your backend
- Note the URL (e.g., `https://your-backend.onrender.com`)

---

## Final Steps

### 1. Update URLs

After both deployments:

1. **Update Vercel Environment Variables:**
   - Replace `https://your-backend-url.onrender.com` with actual Render URL
   - Replace `https://your-app.vercel.app` with actual Vercel URL

2. **Update Render Environment Variables:**
   - Replace `https://your-app.vercel.app` with actual Vercel URL

### 2. Update vercel.json

Update the rewrite URL in `frontend/vercel.json`:
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://YOUR-ACTUAL-RENDER-URL.onrender.com/api/:path*"
  }
]
```

### 3. Test Deployment

1. **Test Backend Health:**
   ```
   https://your-backend.onrender.com/api/health
   ```

2. **Test Frontend:**
   - Open your Vercel URL
   - Upload a PDF
   - Test extraction functionality

---

## Production Optimizations

### Backend (Render)
- ✅ Production CORS configuration
- ✅ Environment-based settings
- ✅ Error handling
- ✅ Security headers
- ✅ File size limits

### Frontend (Vercel)
- ✅ PDF.js worker optimization
- ✅ API proxying
- ✅ Security headers
- ✅ Build optimization
- ✅ Environment variables

---

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure CORS_ORIGIN matches your Vercel URL exactly
   - Check both HTTP and HTTPS

2. **PDF.js Worker Issues:**
   - The `vercel.json` configuration handles worker files
   - Check browser console for worker loading errors

3. **API Connection:**
   - Verify backend health endpoint
   - Check environment variables are set correctly
   - Ensure no trailing slashes in URLs

4. **File Upload Issues:**
   - Render has file size limits
   - Check MAX_FILE_SIZE environment variable
   - MongoDB Atlas connection string should be production-ready

### Monitoring:

- **Vercel:** Dashboard → Functions → View logs
- **Render:** Dashboard → Logs tab
- **MongoDB:** Atlas → Collections → Monitor usage
