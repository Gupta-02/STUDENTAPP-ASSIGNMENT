import { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { useApp } from './contexts/useApp';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Library } from './components/Library';
import { Chat } from './components/Chat';
import { Quiz } from './components/Quiz';
import { YouTube } from './components/YouTube';
import { Progress } from './components/Progress';

function AppContent() {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState<'library' | 'chat' | 'quiz' | 'progress' | 'youtube'>('library');

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'library' && <Library />}
      {currentView === 'chat' && <Chat />}
      {currentView === 'quiz' && <Quiz />}
      {currentView === 'youtube' && <YouTube />}
      {currentView === 'progress' && <Progress />}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
