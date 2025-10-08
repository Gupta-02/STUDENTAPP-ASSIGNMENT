# 🎓 Smart Study Assistant for School Students

> An AI-powered study companion that helps students learn effectively through PDF analysis, intelligent chat, quiz generation, and progress tracking. 



<img width="1913" height="903" alt="image" src="https://github.com/user-attachments/assets/9744bf60-4453-44dd-a9ab-1e401bddaf8e" />


![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Live Demo

[Add your deployed URL here]

## 📸 Screenshots

[Add screenshots of your application here]

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Setup & Installation](#-setup--installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [LLM Integration](#-llm-integration)
- [Deployment](#-deployment)
- [Tradeoffs & Decisions](#-tradeoffs--decisions)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Smart Study Assistant** is a comprehensive learning platform designed specifically for school students. It combines the power of AI with traditional study materials to create an interactive, personalized learning experience.

### Key Capabilities

- 📚 **PDF Management**: Upload or select from pre-loaded NCERT textbooks
- 🤖 **AI Chat Assistant**: Ask questions and get contextual answers using RAG
- 📝 **Quiz Generation**: Auto-generate MCQs, SAQs, and LAQs from content
- 📊 **Progress Tracking**: Monitor performance and identify weak topics
- 🎥 **Video Recommendations**: Get relevant YouTube videos for topics (optional)

---

## ✨ Features

### ✅ Completed Features

| Feature | Status | Description |
|---------|--------|-------------|
| PDF Upload & Processing | ✅ | Upload PDFs with automatic backend processing, text extraction, and vector embeddings |
| PDF Viewer | ✅ | Interactive PDF viewer with zoom and navigation |
| AI Chat Interface | ✅ | ChatGPT-style interface with RAG and backend API integration |
| RAG Implementation | ✅ | Retrieval-Augmented Generation with FAISS vector search |
| Quiz Generator | ✅ | Generate MCQ, SAQ, LAQ, Mixed quizzes from processed PDF content |
| Progress Dashboard | ✅ | Track scores, attempts, and weak topics |
| YouTube Video Integration | ✅ | Dedicated Videos tab with topic-based recommendations |
| Citation Support | ✅ | Show source pages and snippets for answers |
| Responsive UI | ✅ | Mobile-friendly Tailwind design |
| Backend API Integration | ✅ | Full-stack integration for PDF processing, chat, and quizzes |

### 🔄 In Progress

- [ ] Advanced Analytics
- [ ] Study Time Tracker
- [ ] Multi-user Support
- [ ] Offline Mode

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **UI Components**: Custom components with Lucide icons
- **PDF Rendering**: react-pdf
- **Charts**: Recharts
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **File Upload**: Multer
- **PDF Processing**: pdf-parse

### AI/ML Stack
- **LLM Framework**: LangChain
- **LLM Provider**: OpenAI (GPT-3.5-turbo)
- **Embeddings**: OpenAI Embeddings
- **Vector Store**: FAISS (Facebook AI Similarity Search)
- **Text Splitting**: RecursiveCharacterTextSplitter

### Additional APIs
- **YouTube Data API v3** (optional)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Study Room│  │ Progress │  │  Layouts │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│  ┌──────▼──────────────▼──────────────▼──────────────▼──┐  │
│  │        Context (PDF, Chat) + Components              │  │
│  └───────────────────────────┬───────────────────────────┘  │
└────────────────────────────────┼────────────────────────────┘
                                 │ HTTP/REST API
┌────────────────────────────────▼────────────────────────────┐
│                     Backend (Node.js/Express)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   PDF    │  │   Chat   │  │   Quiz   │  │ Progress │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘   │
│        │             │              │              │         │
│  ┌─────▼─────────────▼──────────────▼──────────────▼─────┐ │
│  │                    Services Layer                      │ │
│  │  • PDF Processing  • Chat (RAG)  • Quiz Gen  • Stats  │ │
│  └─────┬──────────────┬──────────────┬──────────────┬─────┘ │
│        │              │              │              │         │
│  ┌─────▼──────┐ ┌─────▼──────┐ ┌────▼─────┐ ┌──────▼─────┐ │
│  │   FAISS    │ │  LangChain │ │  OpenAI  │ │  MongoDB   │ │
│  │Vector Store│ │   + RAG    │ │   API    │ │  Database  │ │
│  └────────────┘ └────────────┘ └──────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **PDF Upload** → Multer → pdf-parse → Text Chunking → Embeddings → FAISS Vector Store
2. **Chat Query** → Vector Search → Retrieve Context → LLM (GPT) → Response with Citations
3. **Quiz Generation** → PDF Context → LLM Prompt → Structured Quiz JSON → Frontend
4. **Progress Tracking** → MongoDB Aggregation → Statistics → Charts

---

## 📥 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- OpenAI API Key
- Git

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd chat-app
```

### 2️⃣ Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3️⃣ Create Environment Files

#### Backend `.env`
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-study-assistant
# Or MongoDB Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/smart-study-assistant

OPENAI_API_KEY=sk-your-openai-api-key-here
YOUTUBE_API_KEY=your-youtube-api-key-here (optional)

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### 4️⃣ Create Upload Directories

```bash
cd backend
mkdir uploads
mkdir vector_store
```

---

## ⚙️ Configuration

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy and paste into `backend/.env`

### MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Connection string: mongodb://localhost:27017/smart-study-assistant
```

**Option B: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to `.env`

### YouTube API (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add to `.env`

---

## 🚀 Running the Application

### Development Mode

Open **two terminals**:

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Production Build

**Frontend**
```bash
cd frontend
npm run build
```

**Backend**
```bash
cd backend
npm start
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Upload PDF
```http
POST /api/upload-pdf
Content-Type: multipart/form-data

Body: { pdf: <file> }

Response:
{
  "success": true,
  "url": "/uploads/filename.pdf",
  "filename": "filename.pdf"
}
```

#### 2. Chat with PDF
```http
POST /api/chat
Content-Type: application/json

Body:
{
  "message": "Explain Newton's laws",
  "pdfId": "1"
}

Response:
{
  "success": true,
  "response": "Newton's laws of motion are...",
  "citations": [
    { "page": 12, "text": "..." }
  ]
}
```

#### 3. Generate Quiz
```http
POST /api/generate-quiz
Content-Type: application/json

Body:
{
  "pdfId": "1",
  "type": "mcq" | "saq" | "mixed"
}

Response:
{
  "success": true,
  "questions": [...]
}
```

#### 4. Save Quiz Result
```http
POST /api/save-quiz-result
Content-Type: application/json

Body:
{
  "pdfId": "1",
  "pdfName": "NCERT Physics",
  "score": 80,
  "totalQuestions": 5,
  "correctAnswers": 4,
  "answers": {}
}
```

#### 5. Get Progress
```http
GET /api/progress

Response:
{
  "totalQuizzes": 10,
  "averageScore": 75,
  "recentQuizzes": [...],
  "weakTopics": [...]
}
```

---

## 🧠 LLM Integration

### RAG Pipeline (Retrieval-Augmented Generation)

```javascript
// 1. PDF Processing
PDF → pdf-parse → Extract Text
     ↓
Text → RecursiveCharacterTextSplitter (chunk_size=1000, overlap=200)
     ↓
Chunks → OpenAI Embeddings
     ↓
Embeddings → FAISS Vector Store (saved to disk)

// 2. Query Processing
User Question → OpenAI Embeddings
     ↓
Embedding → FAISS Similarity Search (top-k=3)
     ↓
Retrieved Chunks → Context

// 3. Answer Generation
Context + Question → GPT-3.5-turbo
     ↓
LLM Response → Answer + Citations
```

### Quiz Generation Prompt Engineering

```javascript
const prompt = `Generate 5 multiple-choice questions from:

${context}

Format: JSON array with question, options, correctAnswer, explanation
Focus on: Key concepts, definitions, applications
Difficulty: School level (Class 11-12)
`;
```

### Models Used

- **Embeddings**: `text-embedding-ada-002` (OpenAI)
- **Chat/Generation**: `gpt-3.5-turbo`
- **Temperature**: 0.7 (chat), 0.8 (quiz generation)

---

## 🌐 Deployment

### Frontend - Vercel

```bash
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

Environment variables in Vercel:
- `VITE_API_URL=https://your-backend-url.com`

### Backend - Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: study-assistant-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: OPENAI_API_KEY
        sync: false
```

2. Push to GitHub
3. Connect to Render
4. Add environment variables

### Database - MongoDB Atlas

Already cloud-based, no deployment needed.

---

## 🎯 Tradeoffs & Decisions

### ✅ What We Chose & Why

| Decision | Reason |
|----------|--------|
| **Vite over CRA** | Faster build times, better DX, modern tooling |
| **TailwindCSS** | Rapid UI development, small bundle size |
| **FAISS over Pinecone** | Free, local storage, no external dependencies |
| **MongoDB over PostgreSQL** | Flexible schema for unstructured quiz data |
| **GPT-3.5 over GPT-4** | Cost-effective, sufficient for educational content |
| **React Context over Redux** | Simpler state management for this scale |
| **Multer for uploads** | Simple, battle-tested, works well with Express |

### ⚖️ Limitations & Tradeoffs

1. **FAISS is local-only**: No cloud sync across deployments
   - *Mitigation*: Can switch to Pinecone/Weaviate for production

2. **No user authentication**: Single-user experience
   - *Mitigation*: Can add JWT auth in future

3. **OpenAI API costs**: Pay-per-token pricing
   - *Mitigation*: Rate limiting, caching, fallback to samples

4. **PDF processing is synchronous**: Large PDFs may timeout
   - *Mitigation*: Background job queue (Bull/Redis) in production

5. **YouTube API quota limits**: 10,000 units/day
   - *Mitigation*: Cache results, show sample videos as fallback

---

## 🔮 Future Enhancements

- [ ] **User Authentication** (JWT + OAuth)
- [ ] **Multi-language Support** (i18n)
- [ ] **Voice Chat** (Whisper API integration)
- [ ] **Collaborative Study Rooms**
- [ ] **Mobile App** (React Native)
- [ ] **Offline Mode** (PWA)
- [ ] **Advanced Analytics** (learning patterns, time tracking)
- [ ] **Gamification** (badges, leaderboards)
- [ ] **Custom Quiz Import/Export**
- [ ] **Video Notes** (timestamp-based notes for YouTube videos)

---

## 📚 What We Learned

1. **LangChain Ecosystem**: Powerful abstractions for LLM apps
2. **Vector Embeddings**: Semantic search is much better than keyword matching
3. **RAG Pattern**: Combining retrieval with generation improves accuracy
4. **Prompt Engineering**: Small prompt changes = big output differences
5. **React Context**: Perfect for small-medium apps, simpler than Redux

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@Gupta-02]
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- LangChain team for excellent documentation
- NCERT for educational content
- React and Node.js communities



Local Testing 


## uploading Pdf

<img width="1909" height="544" alt="image" src="https://github.com/user-attachments/assets/3b4bf719-1d37-4aa1-a067-bc859d64a421" /> 


## Chat Section

<img width="1892" height="739" alt="image" src="https://github.com/user-attachments/assets/df63d500-3eeb-47a0-98a8-fb1aaa0a0e5b" /> 

## Quiz Section 

<img width="1918" height="768" alt="image" src="https://github.com/user-attachments/assets/fed5c902-be2c-4b1b-82a1-c3d85f3dd94b" /> 


## From Selected pdf the relavent Videos

<img width="1529" height="568" alt="image" src="https://github.com/user-attachments/assets/c32b2362-22b2-4d11-a093-651299c1591a" /> 


## From The Progress  

<img width="1898" height="808" alt="image" src="https://github.com/user-attachments/assets/2ac21cb7-fa62-4508-9b15-6b502c94d2d5" />


---

## 📞 Support

For support, email saiprathyun85@gmail.com or open an issue on GitHub.

---

**Made with ❤️ for students everywhere**
