import { createContext, useState, useEffect, ReactNode } from 'react';
import { storage, PDF, Chat, Message, Quiz, QuizAttempt, ProgressData } from '../lib/storage';
import { SEEDED_PDFS } from '../lib/mockData';

interface AppContextType {
  pdfs: PDF[];
  chats: Chat[];
  messages: Message[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  progress: ProgressData[];
  selectedPdfIds: string[];
  currentUser: { email: string } | null;
  addPDF: (pdf: PDF) => void;
  deletePDF: (id: string) => void;
  setSelectedPdfIds: (ids: string[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chat: Chat) => void;
  deleteChat: (id: string) => void;
  addMessage: (message: Message) => void;
  addQuiz: (quiz: Quiz) => void;
  addQuizAttempt: (attempt: QuizAttempt) => void;
  updateProgress: (progress: ProgressData) => void;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export { AppContext };

export function AppProvider({ children }: { children: ReactNode }) {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [selectedPdfIds, setSelectedPdfIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const existingPdfs = storage.getPDFs();
    if (existingPdfs.length === 0) {
      SEEDED_PDFS.forEach(pdf => storage.savePDF(pdf));
      setPdfs(SEEDED_PDFS);
    } else {
      setPdfs(existingPdfs);
    }

    setChats(storage.getChats());
    setMessages(storage.getMessages());
    setQuizzes(storage.getQuizzes());
    setQuizAttempts(storage.getQuizAttempts());
    setProgress(storage.getProgress());
    setCurrentUser(storage.getCurrentUser());
  }, []);

  const addPDF = (pdf: PDF) => {
    storage.savePDF(pdf);
    setPdfs([...pdfs, pdf]);
  };

  const deletePDF = (id: string) => {
    storage.deletePDF(id);
    setPdfs(pdfs.filter(p => p.id !== id));
  };

  const addChat = (chat: Chat) => {
    storage.saveChat(chat);
    setChats([...chats, chat]);
  };

  const updateChat = (chat: Chat) => {
    storage.saveChat(chat);
    setChats(chats.map(c => (c.id === chat.id ? chat : c)));
  };

  const deleteChat = (id: string) => {
    storage.deleteChat(id);
    setChats(chats.filter(c => c.id !== id));
    setMessages(messages.filter(m => m.chatId !== id));
  };

  const addMessage = (message: Message) => {
    storage.saveMessage(message);
    setMessages([...messages, message]);
  };

  const addQuiz = (quiz: Quiz) => {
    storage.saveQuiz(quiz);
    setQuizzes([...quizzes, quiz]);
  };

  const addQuizAttempt = (attempt: QuizAttempt) => {
    storage.saveQuizAttempt(attempt);
    setQuizAttempts([...quizAttempts, attempt]);
  };

  const updateProgress = (newProgress: ProgressData) => {
    storage.saveProgress(newProgress);
    setProgress(
      progress.some(p => p.pdfId === newProgress.pdfId && p.topic === newProgress.topic)
        ? progress.map(p =>
            p.pdfId === newProgress.pdfId && p.topic === newProgress.topic ? newProgress : p
          )
        : [...progress, newProgress]
    );
  };

  const login = (email: string) => {
    const user = { email };
    storage.setCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        pdfs,
        chats,
        messages,
        quizzes,
        quizAttempts,
        progress,
        selectedPdfIds,
        currentUser,
        addPDF,
        deletePDF,
        setSelectedPdfIds,
        addChat,
        updateChat,
        deleteChat,
        addMessage,
        addQuiz,
        addQuizAttempt,
        updateProgress,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
