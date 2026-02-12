import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PS5Card from '../components/PS5Card';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [startTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setShiftSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCloseShift = () => {
    const h = Math.floor(shiftSeconds / 3600);
    const m = Math.floor((shiftSeconds % 3600) / 60);
    // In the future, this is where we send data to the Admin's history database
    const confirmClose = window.confirm(
      `ATTENTION: You are about to close your shift.\n\n` +
      `Total Time Worked: ${h}:${m} hours.\n\n` +
      `Are you sure you want to exit?`
    );

    if (confirmClose) {
      alert(`Shift logged for ${user.name}. Great work!`);
      navigate('/');
    }
  };

  const formatShiftTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div style={fullScreenContainer}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>PS5 Cafe Dashboard</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
            <span style={{ color: '#888' }}>Staff: <strong>{user.name}</strong></span>
            <span style={{ color: '#4ade80' }}>Shift Duration: <strong>{formatShiftTime(shiftSeconds)}</strong></span>
          </div>
        </div>
        <button onClick={handleCloseShift} style={closeShiftBtn}>Close Shift</button>
      </header>

      <div style={gridStyle}>
        {[1, 2, 3, 4, 5].map(num => <PS5Card key={num} stationNumber={num} />)}
      </div>
    </div>
  );
};

const fullScreenContainer = { width: '100vw', minHeight: '100vh', backgroundColor: '#0f0f0f', color: 'white', padding: '40px', boxSizing: 'border-box' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', width: '100%' };
const closeShiftBtn = { padding: '12px 24px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default Dashboard;