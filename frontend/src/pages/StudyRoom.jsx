import { useState } from 'react';
import PDFSelector from '../components/PDFSelector';
import PDFViewer from '../components/PDFViewer';
import ChatInterface from '../components/ChatInterface';
import QuizGenerator from '../components/QuizGenerator';
import { usePDF } from '../context/PDFContext';

const StudyRoom = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { selectedPDF } = usePDF();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-800">Study Room</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar - PDF Selector */}
        <div className="lg:col-span-1">
          <PDFSelector />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* PDF Viewer */}
            <div className="h-[600px]">
              <PDFViewer pdfUrl={selectedPDF?.url} />
            </div>

            {/* Chat/Quiz Panel */}
            <div className="h-[600px]">
              {/* Tabs */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                    activeTab === 'quiz'
                      ? 'bg-white text-primary-600 border-b-2 border-primary-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📝 Quiz
                </button>
              </div>

              {/* Content */}
              {activeTab === 'chat' ? (
                <ChatInterface />
              ) : (
                <QuizGenerator pdfId={selectedPDF?.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
