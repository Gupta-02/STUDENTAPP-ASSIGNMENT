import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';
import Progress from './pages/Progress';
import { PDFProvider } from './context/PDFContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <PDFProvider>
      <ChatProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/study" element={<StudyRoom />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </Layout>
        </Router>
      </ChatProvider>
    </PDFProvider>
  );
}

export default App;
