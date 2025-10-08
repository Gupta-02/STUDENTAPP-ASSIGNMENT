export interface PDF {
  id: string;
  title: string;
  filePath: string;
  pageCount: number;
  isSeeded: boolean;
  uploadedAt: string;
  backendId?: string; // Backend filename for API calls
}

export interface Chat {
  id: string;
  title: string;
  pdfIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ page: number; snippet: string; pdfId: string }>;
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'saq' | 'laq';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface Quiz {
  id: string;
  pdfIds: string[];
  quizType: 'mcq' | 'saq' | 'laq' | 'mixed';
  questions: Question[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface ProgressData {
  pdfId: string;
  topic: string;
  strengthScore: number;
  quizCount: number;
  correctAnswers: number;
  totalAnswers: number;
  lastAttempt: string;
}

const STORAGE_KEYS = {
  PDFS: 'study_app_pdfs',
  CHATS: 'study_app_chats',
  MESSAGES: 'study_app_messages',
  QUIZZES: 'study_app_quizzes',
  QUIZ_ATTEMPTS: 'study_app_quiz_attempts',
  PROGRESS: 'study_app_progress',
  CURRENT_USER: 'study_app_current_user',
};

export const storage = {
  getPDFs: (): PDF[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PDFS);
    return data ? JSON.parse(data) : [];
  },

  savePDF: (pdf: PDF) => {
    const pdfs = storage.getPDFs();
    pdfs.push(pdf);
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(pdfs));
  },

  deletePDF: (id: string) => {
    const pdfs = storage.getPDFs().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(pdfs));
  },

  getChats: (): Chat[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  },

  saveChat: (chat: Chat) => {
    const chats = storage.getChats();
    const index = chats.findIndex(c => c.id === chat.id);
    if (index >= 0) {
      chats[index] = chat;
    } else {
      chats.push(chat);
    }
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  deleteChat: (id: string) => {
    const chats = storage.getChats().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    const messages = storage.getMessages().filter(m => m.chatId !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  getMessages: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  },

  saveMessage: (message: Message) => {
    const messages = storage.getMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  getQuizzes: (): Quiz[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : [];
  },

  saveQuiz: (quiz: Quiz) => {
    const quizzes = storage.getQuizzes();
    quizzes.push(quiz);
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  getQuizAttempts: (): QuizAttempt[] => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    return data ? JSON.parse(data) : [];
  },

  saveQuizAttempt: (attempt: QuizAttempt) => {
    const attempts = storage.getQuizAttempts();
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));
  },

  getProgress: (): ProgressData[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : [];
  },

  saveProgress: (progress: ProgressData) => {
    const progressList = storage.getProgress();
    const index = progressList.findIndex(
      p => p.pdfId === progress.pdfId && p.topic === progress.topic
    );
    if (index >= 0) {
      progressList[index] = progress;
    } else {
      progressList.push(progress);
    }
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));
  },

  getCurrentUser: (): { email: string } | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: { email: string } | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
};
