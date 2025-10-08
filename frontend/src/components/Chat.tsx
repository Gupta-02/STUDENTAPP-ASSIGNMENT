import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Trash2, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/useApp';
import { Chat as ChatType, Message } from '../lib/storage';
import { generateChatResponse } from '../lib/aiService';

export function Chat() {
  const { chats, messages, selectedPdfIds, pdfs, addChat, deleteChat, addMessage } = useApp();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === currentChatId);
  const currentMessages = messages.filter(m => m.chatId === currentChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleNewChat = () => {
    const newChat: ChatType = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      pdfIds: selectedPdfIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addChat(newChat);
    setCurrentChatId(newChat.id);
    setDrawerOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: currentChatId,
      role: 'user',
      content: inputMessage,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const selectedPdfs = pdfs.filter(p => selectedPdfIds.includes(p.id));
      const pdfContext = selectedPdfs.map(p => `${p.title}`).join(', ');

      // Use the first selected PDF's backend ID for backend API call
      const primaryPdf = selectedPdfs[0];
      const backendPdfId = primaryPdf?.backendId || primaryPdf?.id;

      const conversationHistory = currentMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await generateChatResponse(
        inputMessage,
        pdfContext,
        conversationHistory,
        backendPdfId
      );

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        chatId: currentChatId,
        role: 'assistant',
        content: response.content,
        citations: response.citations,
        createdAt: new Date().toISOString(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-73px)] flex">
      <div
        className={`${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white border-r-2 border-black transition-transform`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b-2 border-black">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-auto p-2">
            {chats.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-8 px-4">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setDrawerOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors group ${
                    currentChatId === chat.id
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {chat.title}
                        </span>
                      </div>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this chat?')) {
                          deleteChat(chat.id);
                          if (currentChatId === chat.id) {
                            setCurrentChatId(null);
                          }
                        }
                      }}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        currentChatId === chat.id
                          ? 'hover:bg-gray-800'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col bg-white">
        {!currentChatId ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-lg mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Start Learning</h3>
              <p className="text-gray-600 mb-6">
                Create a new chat to ask questions about your selected PDFs. Your AI tutor is
                ready to help!
              </p>
              <button
                onClick={handleNewChat}
                className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Start New Chat
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden mt-4 text-black underline"
              >
                View Chat History
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b-2 border-black p-4 bg-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h3 className="font-bold text-black">{currentChat?.title}</h3>
                  {selectedPdfIds.length > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <BookOpen className="w-3 h-3" />
                      <span>
                        {selectedPdfIds.length} PDF{selectedPdfIds.length > 1 ? 's' : ''} in
                        context
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black border-2 border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                        {message.citations.map((citation, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">Page {citation.page}:</span>{' '}
                            <span className="italic">"{citation.snippet}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t-2 border-black p-4 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your PDFs..."
                  className="flex-1 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
