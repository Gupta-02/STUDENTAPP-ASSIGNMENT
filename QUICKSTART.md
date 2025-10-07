# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ MongoDB running (local or Atlas account)
- ✅ OpenAI API key ready

## 🎯 3-Minute Setup

### Step 1: Install Dependencies

```powershell
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Step 2: Configure Backend

```powershell
cd backend

# Copy environment template
Copy-Item .env.example .env

# Create required directories
New-Item -ItemType Directory -Force -Path uploads
New-Item -ItemType Directory -Force -Path vector_store
```

Edit `backend/.env` and add your API keys:
```env
OPENAI_API_KEY=sk-your-key-here
MONGODB_URI=mongodb://localhost:27017/smart-study-assistant
```

### Step 3: Start the Application

**Terminal 1 - Backend**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend**
```powershell
cd frontend
npm run dev
```

### Step 4: Open Browser

Navigate to: `http://localhost:3000`

## 🧪 Testing the Features

1. **Dashboard**: See overview and stats
2. **Study Room**: 
   - Select a PDF (sample data loads automatically)
   - Try the chat interface
   - Generate a quiz
3. **Progress**: View your learning analytics

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Frontend (change in vite.config.js)
# Backend (change PORT in .env)
```

### OpenAI API Error
- Verify API key is correct
- Check you have credits available
- The app works with sample data if no API key

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud)
- The app works without DB (no persistence)

## 📚 Next Steps

1. Read the [full README](../README.md)
2. Check [API documentation](../README.md#-api-documentation)
3. Explore the codebase
4. Add your own features!

## 💡 Tips

- The app has fallback sample data when APIs aren't configured
- Start without MongoDB for quick testing
- Use `.env.example` as reference for all config options
- Check console logs for detailed debugging info

## 🎓 Learning Resources

- [LangChain Docs](https://js.langchain.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)

---

**Need Help?** Open an issue on GitHub or check the README.md
