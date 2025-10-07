import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { usePDF } from '../context/PDFContext';

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const { selectedPDF } = usePDF();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedPDF) return;

    await sendMessage(input, selectedPDF.id);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary-600 to-primary-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Bot className="h-6 w-6 mr-2" />
          Study Assistant Chat
        </h2>
        {selectedPDF && (
          <p className="text-primary-100 text-sm mt-1">Context: {selectedPDF.name}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Start a conversation!</p>
            <p className="text-gray-400 text-sm mt-2">
              Ask questions about your study material
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-primary-600 ml-2'
                        : 'bg-gray-600 mr-2'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p className="font-medium">Sources:</p>
                        {message.citations.map((citation, idx) => (
                          <p key={idx} className="italic">• Page {citation.page}: "{citation.text}"</p>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
                  <Loader className="h-4 w-4 animate-spin text-primary-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedPDF ? "Ask a question about the PDF..." : "Please select a PDF first"}
            disabled={!selectedPDF || isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!selectedPDF || !input.trim() || isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
