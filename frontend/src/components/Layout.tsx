import React, { ReactNode } from 'react';
import { BookOpen, MessageSquare, GraduationCap, BarChart3, Youtube, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/useApp';

interface LayoutProps {
  children: ReactNode;
  currentView: 'library' | 'chat' | 'quiz' | 'progress' | 'youtube';
  onViewChange: (view: 'library' | 'chat' | 'quiz' | 'progress' | 'youtube') => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'library' as const, icon: BookOpen, label: 'Library' },
    { id: 'chat' as const, icon: MessageSquare, label: 'Chat' },
    { id: 'quiz' as const, icon: GraduationCap, label: 'Quiz' },
    { id: 'youtube' as const, icon: Youtube, label: 'Videos' },
    { id: 'progress' as const, icon: BarChart3, label: 'Progress' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-black text-white border-b-2 border-black sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">StudyRevise</h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-gray-300">{currentUser?.email}</span>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-800 p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  currentView === item.id
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
