import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, BarChart3, Upload } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'PDF Study Materials',
      description: 'Upload or select from NCERT textbooks to start studying',
      color: 'bg-blue-500',
      action: () => navigate('/study'),
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Ask questions and get contextual answers from your PDFs',
      color: 'bg-green-500',
      action: () => navigate('/study'),
    },
    {
      icon: BarChart3,
      title: 'Track Progress',
      description: 'Monitor your learning journey and identify weak topics',
      color: 'bg-purple-500',
      action: () => navigate('/progress'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Smart Study Assistant</h1>
        <p className="text-xl text-primary-100 mb-6">
          Your AI-powered companion for effective learning and exam preparation
        </p>
        <button
          onClick={() => navigate('/study')}
          className="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          Start Studying Now
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            onClick={feature.action}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600">PDFs Studied</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Quizzes Taken</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">0%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-sm text-gray-600">Study Hours</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Select or Upload PDF</h4>
              <p className="text-gray-600">Choose from NCERT textbooks or upload your own study material</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Study & Chat</h4>
              <p className="text-gray-600">Read the PDF and ask questions to the AI assistant for clarification</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Take Quizzes</h4>
              <p className="text-gray-600">Test your knowledge with AI-generated MCQs and subjective questions</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Track Progress</h4>
              <p className="text-gray-600">Monitor your performance and identify topics that need more attention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
