# Smart Study Assistant - Project Structure

```
chat-app/
│
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Layout.jsx      # Main layout with navigation
│   │   │   ├── PDFSelector.jsx # PDF selection/upload component
│   │   │   ├── PDFViewer.jsx   # PDF display component
│   │   │   ├── ChatInterface.jsx # Chat UI component
│   │   │   └── QuizGenerator.jsx # Quiz generation & display
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx   # Landing/overview page
│   │   │   ├── StudyRoom.jsx   # Main study interface
│   │   │   └── Progress.jsx    # Analytics & progress tracking
│   │   │
│   │   ├── context/            # React Context for state
│   │   │   ├── PDFContext.jsx  # PDF state management
│   │   │   └── ChatContext.jsx # Chat state management
│   │   │
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles (Tailwind)
│   │
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── backend/                    # Node.js + Express Backend
│   ├── models/                 # Mongoose schemas
│   │   ├── PDF.js              # PDF metadata model
│   │   ├── QuizResult.js       # Quiz results model
│   │   └── ChatHistory.js      # Chat history model
│   │
│   ├── routes/                 # API route handlers
│   │   ├── pdfRoutes.js        # PDF upload/management endpoints
│   │   ├── chatRoutes.js       # Chat API endpoints
│   │   ├── quizRoutes.js       # Quiz generation endpoints
│   │   └── progressRoutes.js   # Progress tracking endpoints
│   │
│   ├── services/               # Business logic & AI services
│   │   ├── pdfService.js       # PDF processing, chunking, embeddings
│   │   ├── chatService.js      # RAG implementation for chat
│   │   ├── quizService.js      # Quiz generation with LLM
│   │   └── youtubeService.js   # YouTube video recommendations
│   │
│   ├── uploads/                # Uploaded PDF storage (created at runtime)
│   ├── vector_store/           # FAISS vector databases (created at runtime)
│   │
│   ├── server.js               # Express server entry point
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   └── .gitignore              # Git ignore file
│
├── .github/                    # GitHub specific files
│   └── workflows/              # CI/CD workflows (optional)
│
├── README.md                   # Comprehensive project documentation
├── QUICKSTART.md               # Quick setup guide
├── LICENSE                     # MIT License
├── .gitignore                  # Root gitignore
├── package.json                # Root package.json for scripts
├── install.ps1                 # PowerShell installation script
└── render.yaml                 # Render.com deployment config

```

## Key Technologies by Directory

### Frontend (`/frontend`)
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS
- **react-pdf**: PDF rendering
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **Axios**: HTTP client

### Backend (`/backend`)
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **LangChain**: LLM framework
- **OpenAI**: LLM provider
- **FAISS**: Vector similarity search
- **dotenv**: Environment configuration

## Data Flow

1. **PDF Upload Flow**
   ```
   Frontend Upload → Multer → File System → pdf-parse → 
   Text Splitter → OpenAI Embeddings → FAISS Vector Store
   ```

2. **Chat Flow (RAG)**
   ```
   User Question → Embedding → FAISS Search → Context Retrieval →
   LLM Prompt → OpenAI API → Response → Frontend
   ```

3. **Quiz Generation Flow**
   ```
   PDF Selection → Context Extraction → LLM Prompt → 
   Quiz JSON → Frontend Display → User Answers → 
   Score Calculation → MongoDB Storage
   ```

4. **Progress Tracking Flow**
   ```
   Quiz Results → MongoDB → Aggregation → Statistics → 
   Chart Data → Frontend Visualization
   ```

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key (required for AI features)
- `YOUTUBE_API_KEY`: YouTube Data API key (optional)
- `UPLOAD_DIR`: Upload directory path
- `MAX_FILE_SIZE`: Maximum upload size in bytes

### Frontend
- `VITE_API_URL`: Backend API URL (for production)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload-pdf` | Upload PDF file |
| POST | `/api/chat` | Send chat message |
| POST | `/api/generate-quiz` | Generate quiz from PDF |
| POST | `/api/save-quiz-result` | Save quiz attempt |
| GET | `/api/progress` | Get user progress stats |
| GET | `/api/health` | Health check endpoint |

## Database Schema

### PDF Collection
```javascript
{
  name: String,
  url: String,
  type: 'preset' | 'uploaded',
  uploadedAt: Date,
  processed: Boolean,
  chunks: [{ text: String, page: Number, embedding: [Number] }]
}
```

### QuizResult Collection
```javascript
{
  pdfId: String,
  pdfName: String,
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  answers: Map<String, String>,
  takenAt: Date,
  weakTopics: [String]
}
```

### ChatHistory Collection
```javascript
{
  pdfId: String,
  messages: [{
    text: String,
    sender: 'user' | 'bot',
    timestamp: Date,
    citations: [{ page: Number, text: String }]
  }],
  createdAt: Date
}
```

## Development Workflow

1. **Start Development**
   ```powershell
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Make Changes**
   - Frontend changes auto-reload (Vite HMR)
   - Backend changes auto-reload (nodemon)

3. **Test Features**
   - Upload PDF → Study Room
   - Chat with AI → Chat tab
   - Generate Quiz → Quiz tab
   - View Progress → Progress page

4. **Build for Production**
   ```powershell
   cd frontend && npm run build
   cd backend && npm start
   ```

## Deployment Architecture

```
┌─────────────────┐
│   Vercel/       │
│   Netlify       │  ← Frontend (Static)
│   (Frontend)    │
└────────┬────────┘
         │ API Calls
         │
┌────────▼────────┐
│   Render/       │
│   Railway       │  ← Backend (Node.js)
│   (Backend)     │
└────────┬────────┘
         │
         ├─────────► MongoDB Atlas (Database)
         │
         └─────────► OpenAI API (LLM)
```

---

**For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)**

**For full documentation, see [README.md](README.md)**
