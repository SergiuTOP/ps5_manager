import React, { useState, useEffect } from 'react';
import { Monitor, Play, Lock } from 'lucide-react';

const PS5Card = ({ stationNumber }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [customHours, setCustomHours] = useState("");

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Logic for turning off TV goes here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const validateAndStart = (hours) => {
    const h = parseFloat(hours);
    if (isNaN(h) || h <= 0) return alert("Enter valid hours");

    const confirmAction = window.confirm(`Start Station #${stationNumber} for ${h} hours?`);
    if (confirmAction) {
      const pwd = window.prompt("Enter password to confirm session (This cannot be cancelled):");
      if (pwd === "123") { 
        setTimeLeft(Math.floor(h * 3600));
        setIsActive(true);
        setCustomHours("");
      } else {
        alert("Incorrect password.");
      }
    }
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: isActive ? '#064e3b' : '#1a1a1a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '220px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Monitor size={20} color={isActive ? '#4ade80' : '#888'} />
        <h3 style={{ margin: 0 }}>Station #{stationNumber}</h3>
      </div>

      {isActive ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', margin: '15px 0' }}>{formatTime(timeLeft)}</h2>
          <div style={{ color: '#888', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <Lock size={12} /> Session Locked
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => validateAndStart(0.5)} style={quickBtnStyle}>30m</button>
            <button onClick={() => validateAndStart(1)} style={quickBtnStyle}>1h</button>
            <button onClick={() => validateAndStart(2)} style={quickBtnStyle}>2h</button>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="number" step="0.1" placeholder="Hours" 
              value={customHours} onChange={(e) => setCustomHours(e.target.value)}
              style={inputStyle}
            />
            <button onClick={() => validateAndStart(customHours)} style={startBtnStyle}><Play size={16} fill="white"/></button>
          </div>
        </div>
      )}
    </div>
  );
};

const quickBtnStyle = { flex: 1, padding: '8px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' };
const startBtnStyle = { padding: '8px 15px', backgroundColor: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const inputStyle = { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#000', color: 'white' };

export default PS5Card;