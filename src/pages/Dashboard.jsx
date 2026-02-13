import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure this path is correct
import PS5Card from '../components/PS5Card';

// --- Sub-Component: Shift Modal ---
const ShiftModal = ({ isOpen, user, seconds, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return (
    <div style={styles.overlay}>
      <div style={styles.modalBox}>
        <h2 style={{ marginTop: 0, color: 'white' }}>Close Shift?</h2>
        <div style={styles.summaryBox}>
          <p style={styles.label}>Staff Member</p>
          <p style={styles.value}>{user?.name || 'Staff'}</p>
          
          <p style={styles.label}>Total Time Worked</p>
          <p style={{ ...styles.value, color: '#4ade80' }}>
            {h}h {m}m
          </p>
        </div>
        <p style={styles.subtext}>Are you sure you want to end your shift and log out?</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onCancel} style={styles.cancelBtn}>Stay on Shift</button>
          <button onClick={onConfirm} style={styles.confirmBtn}>Close & Logout</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component: Dashboard ---
const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [shiftSeconds, setShiftSeconds] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Single Effect for Timer and Supabase Presence
  useEffect(() => {
    // Start shift clock
    const interval = setInterval(() => {
      setShiftSeconds((prev) => prev + 1);
    }, 1000);

    // Tell Supabase we are online
    const toggleOnlineStatus = async (status) => {
      await supabase
        .from('profiles')
        .upsert({ 
          username: user?.name || 'Staff', 
          is_online: status, 
          last_login: new Date() 
        }, { onConflict: 'username' });
    };

    toggleOnlineStatus(true);

    // Cleanup when component unmounts (closes/refreshes)
    return () => {
      clearInterval(interval);
      toggleOnlineStatus(false);
    };
  }, [user?.name]);

  const formatShiftTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const handleFinalCloseShift = async () => {
    const h = (shiftSeconds / 3600).toFixed(2);
    
    // Save to permanent Supabase history
    await supabase.from('history').insert([{
      type: 'SHIFT',
      staff_name: user?.name || 'Staff',
      duration: parseFloat(h),
      timestamp: new Date().toISOString()
    }]);

    navigate('/');
  };

  return (
    <div style={styles.fullScreenContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>PS5 Cafe Dashboard</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
            <span style={{ color: '#888' }}>Staff: <strong>{user?.name || 'Staff'}</strong></span>
            <span style={{ color: '#4ade80' }}>Shift Duration: <strong>{formatShiftTime(shiftSeconds)}</strong></span>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={styles.closeShiftBtn}>Close Shift</button>
      </header>

      <div style={styles.grid}>
        {[1, 2, 3, 4, 5].map(num => (
          <PS5Card key={num} stationNumber={num} />
        ))}
      </div>

      <ShiftModal 
        isOpen={isModalOpen}
        user={user}
        seconds={shiftSeconds}
        onConfirm={handleFinalCloseShift}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// --- Styles Object (Cleaner management) ---
const styles = {
  fullScreenContainer: { width: '100vw', minHeight: '100vh', backgroundColor: '#0f0f0f', color: 'white', padding: '40px', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', width: '100%' },
  closeShiftBtn: { padding: '12px 24px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalBox: { backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '400px', textAlign: 'center' },
  summaryBox: { backgroundColor: '#000', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #222' },
  label: { margin: '5px 0', color: '#888', fontSize: '0.9rem' },
  value: { margin: '0 0 15px 0', fontSize: '1.4rem', fontWeight: 'bold' },
  subtext: { color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  confirmBtn: { padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Dashboard;