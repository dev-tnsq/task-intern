import React from 'react';
import TaskManager from './TaskManager';

const Dashboard: React.FC = () => {
  const username = localStorage.getItem('username');
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Tracker</h1>
        <span>Welcome, {username}</span>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        <TaskManager />
      </main>
    </div>
  );
};

export default Dashboard; 