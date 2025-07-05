import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const username = localStorage.getItem('username');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={username ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={username ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
