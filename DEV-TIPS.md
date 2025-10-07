# 🛠️ Development Tips & Best Practices

## 🎯 Daily Development Workflow

### Morning Setup
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - Free for git commands, testing, etc.
```

### Making Changes

**Frontend Changes**
- Edit files in `frontend/src/`
- Changes auto-reload (Vite HMR)
- Check browser console for errors
- Use React DevTools for debugging

**Backend Changes**
- Edit files in `backend/`
- Server auto-restarts (nodemon)
- Check terminal for errors
- Use Postman/Thunder Client for API testing

## 🔍 Debugging Tips

### Frontend Debugging
```javascript
// Add console logs in components
console.log('Component rendered:', { selectedPDF, messages });

// Use React DevTools (Chrome Extension)
// Components tab → Select component → See props & state

// Check network requests
// Browser DevTools → Network tab → Filter by XHR
```

### Backend Debugging
```javascript
// Add detailed logging in services
console.log('📄 Processing PDF:', pdfId);
console.log('🔍 Search results:', results);
console.log('✅ Response sent:', response);

// Use try-catch blocks
try {
  // Your code
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
```

### Common Issues & Fixes

**Issue: React component not updating**
```javascript
// Fix: Make sure state is updated immutably
setMessages([...messages, newMessage]); // ✅ Good
messages.push(newMessage); // ❌ Bad
```

**Issue: API call failing**
```javascript
// Check: 
// 1. Backend is running on correct port
// 2. CORS is enabled
// 3. Request URL is correct
// 4. Check browser console for CORS errors
```

**Issue: OpenAI API errors**
```javascript
// Check:
// 1. API key is correct in .env
// 2. You have credits available
// 3. Check OpenAI status page
// 4. Rate limits not exceeded
```

## 📝 Code Quality Tips

### Component Organization
```jsx
// Good component structure:
const MyComponent = () => {
  // 1. Hooks at the top
  const [state, setState] = useState(initial);
  const { context } = useContext(MyContext);
  
  // 2. Effects
  useEffect(() => {
    // side effects
  }, [deps]);
  
  // 3. Functions
  const handleClick = () => {
    // logic
  };
  
  // 4. Early returns
  if (!data) return <Loading />;
  
  // 5. Main render
  return (
    <div>Content</div>
  );
};
```

### API Service Organization
```javascript
// Good service structure:
export async function myService(param) {
  try {
    // 1. Validation
    if (!param) throw new Error('Param required');
    
    // 2. Process
    const result = await doSomething(param);
    
    // 3. Return
    return { success: true, data: result };
  } catch (error) {
    // 4. Error handling
    console.error('Service error:', error);
    throw error;
  }
}
```

## 🧪 Testing Your Changes

### Manual Testing Checklist

**PDF Upload**
- [ ] Can select preset PDFs
- [ ] Can upload custom PDF
- [ ] Upload shows progress/loading
- [ ] PDF appears in viewer
- [ ] Can navigate PDF pages
- [ ] Zoom works

**Chat Feature**
- [ ] Chat input is enabled after PDF selection
- [ ] Messages appear in chat
- [ ] AI responses are contextual
- [ ] Citations show page numbers
- [ ] Loading state shows while waiting
- [ ] Error handling works

**Quiz Feature**
- [ ] Quiz generation works
- [ ] All question types display
- [ ] Can select answers
- [ ] Can navigate questions
- [ ] Submit shows results
- [ ] Explanations display

**Progress Feature**
- [ ] Stats calculate correctly
- [ ] Charts render
- [ ] Recent activity shows
- [ ] Weak topics identified

### API Testing with Curl

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Test chat (requires PDF to be processed)
curl -X POST http://localhost:5000/api/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"test\",\"pdfId\":\"1\"}'

# Test quiz generation
curl -X POST http://localhost:5000/api/generate-quiz `
  -H "Content-Type: application/json" `
  -d '{\"pdfId\":\"1\",\"type\":\"mcq\"}'
```

## 🚀 Performance Tips

### Frontend Optimization
```javascript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // rendering logic
});

// Lazy load pages
const Progress = lazy(() => import('./pages/Progress'));

// Debounce search/input
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
);
```

### Backend Optimization
```javascript
// Cache frequently accessed data
const cache = new Map();

// Use connection pooling for MongoDB
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2
});

// Limit result sizes
const results = await vectorStore.similaritySearch(query, 3); // Not 100
```

## 📚 Learning Resources

### When You're Stuck
1. Check browser/terminal console
2. Read the error message carefully
3. Google: "error message + react/express/langchain"
4. Check official docs:
   - React: https://react.dev
   - Express: https://expressjs.com
   - LangChain: https://js.langchain.com
   - OpenAI: https://platform.openai.com/docs

### Understanding the AI Parts

**What is RAG?**
- **R**etrieval: Search PDF for relevant info
- **A**ugmented: Add that info to the prompt
- **G**eneration: LLM generates answer with context

**How Embeddings Work**
```
"Newton's laws" → OpenAI → [0.1, 0.5, -0.3, ...] (1536 numbers)
"Physics motion" → OpenAI → [0.2, 0.4, -0.2, ...] (similar numbers!)
```
Similar text → Similar embeddings → Can find related content

**FAISS Vector Search**
```
Question embedding → Search FAISS → Find similar PDF chunks
→ Use as context → Better LLM answers
```

## 🎨 UI/UX Tips

### Design Consistency
- Use Tailwind classes consistently
- Stick to color palette (primary-600, gray-800, etc.)
- Maintain spacing (p-4, m-2, space-y-4, etc.)
- Use Lucide icons throughout

### User Feedback
```jsx
// Always show loading states
{isLoading && <Loader className="animate-spin" />}

// Show error messages
{error && <p className="text-red-500">{error}</p>}

// Disable buttons during actions
<button disabled={isLoading} className="disabled:opacity-50">
```

## 🔐 Security Best Practices

### Environment Variables
```javascript
// ❌ Never commit .env files
// ✅ Use .env.example as template
// ✅ Add .env to .gitignore
```

### API Keys
```javascript
// ❌ Never expose API keys in frontend
// ✅ Keep them in backend .env
// ✅ Never log API keys
```

### User Input
```javascript
// ✅ Validate all user input
if (!message || message.trim().length === 0) {
  return res.status(400).json({ error: 'Message required' });
}

// ✅ Sanitize file uploads
if (file.mimetype !== 'application/pdf') {
  return res.status(400).json({ error: 'Only PDFs allowed' });
}
```

## 📊 Monitoring & Logging

### Good Logging Practice
```javascript
// Backend service logs
console.log('📄 [PDF Service] Processing:', filename);
console.log('🔍 [Vector Search] Found', results.length, 'matches');
console.log('✅ [Chat Service] Response generated');
console.error('❌ [Error]', error.message);

// Use emojis for quick scanning
// 📄 = File operations
// 🔍 = Search/retrieval
// 💬 = Chat/messaging
// ✅ = Success
// ❌ = Error
// ⚠️ = Warning
```

## 🎯 Git Best Practices

### Commit Messages
```bash
# Good commits
git commit -m "feat: Add PDF upload validation"
git commit -m "fix: Resolve chat context issue"
git commit -m "docs: Update README with deployment steps"

# Types: feat, fix, docs, style, refactor, test, chore
```

### Branching
```bash
# Create feature branch
git checkout -b feature/youtube-integration

# Work on it
git add .
git commit -m "feat: Add YouTube API integration"

# Merge back
git checkout main
git merge feature/youtube-integration
```

## 🚀 Before Deploying

### Pre-deployment Checklist
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] README updated with live URLs
- [ ] Error handling in place
- [ ] Loading states everywhere
- [ ] Mobile responsive
- [ ] API keys not in code
- [ ] .gitignore configured
- [ ] Dependencies up to date
- [ ] No console.logs in production code

### Build Testing
```powershell
# Test production build locally
cd frontend
npm run build
npm run preview

# Test backend in production mode
cd backend
set NODE_ENV=production
npm start
```

## 💡 Pro Tips

1. **Use VS Code Extensions**
   - ESLint
   - Prettier
   - Thunder Client (API testing)
   - React Developer Tools
   - Tailwind CSS IntelliSense

2. **Keyboard Shortcuts**
   - `Ctrl + P` - Quick file open
   - `Ctrl + Shift + F` - Search across files
   - `F12` - Go to definition
   - `Ctrl + /` - Toggle comment

3. **Hot Module Replacement**
   - Frontend changes = instant reload
   - Backend changes = auto restart
   - No need to manually refresh!

4. **Browser DevTools**
   - `F12` - Open DevTools
   - Console tab - See logs and errors
   - Network tab - Debug API calls
   - React tab - Inspect components

## 🎓 Remember

- **Code is read more than written** - Make it clear
- **Perfect is the enemy of good** - Ship first, polish later
- **Console.log is your friend** - Debug with confidence
- **Google is your teacher** - Everyone searches for help
- **Breaks are productive** - Step away when stuck

---

**Happy Coding! 🚀**

*The best way to learn is by building. You're doing great!*
