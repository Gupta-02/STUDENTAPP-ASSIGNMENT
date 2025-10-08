import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useApp } from '../contexts/useApp';

export function Auth() {
  const [email, setEmail] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-lg mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">StudyRevise</h1>
          <p className="text-gray-600">Your AI-powered learning companion</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-8 rounded-lg">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="student@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Demo mode - No password required
          </p>
        </form>
      </div>
    </div>
  );
}
