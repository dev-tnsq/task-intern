import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [, setStoredUsername] = useLocalStorage('taskTracker_username', '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setStoredUsername(username.trim());
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Task Tracker</h1>
            <p className="text-gray-500">Welcome! Please enter your name to get started.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your name..."
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded text-lg hover:bg-blue-600 transition"
              disabled={!username.trim()}
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 