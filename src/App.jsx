import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminHistory from './pages/AdminHistory';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* First page anyone sees is Login */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Protect Dashboard: Only for logged in users */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />} 
        />

        {/* Protect Admin: Only for the admin user */}
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminHistory /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;