import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setUser({ role: 'admin', name: 'Admin' });
      navigate('/admin');
    } else if (username === 'cashier' && password === '123') {
      setUser({ role: 'cashier', name: 'Staff' });
      navigate('/dashboard');
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={fullPageCenter}>
      <div style={loginBox}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>System Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" placeholder="Username" style={inputStyle}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" style={inputStyle}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={loginBtn}>Login</button>
        </form>
      </div>
    </div>
  );
};

// Styles for perfect centering
const fullPageCenter = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    backgroundColor: '#0f0f0f', 
    color: 'white' };
const loginBox = { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', border: '1px solid #333', width: '320px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#000', color: 'white', outline: 'none' };
const loginBtn = { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;