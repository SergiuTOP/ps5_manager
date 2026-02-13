import React, { useState, useEffect } from 'react';
import { Monitor, Play, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

// --- Sub-Component: Confirmation Modal ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, pwd, setPwd }) => {
  if (!isOpen) return null;
  return (
    <div style={styles.overlay}>
      <div style={styles.modalBox}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>{message}</p>
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          style={styles.modalInput}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
          <button onClick={onConfirm} style={styles.confirmBtn}>Start Session</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const PS5Card = ({ stationNumber }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [customHours, setCustomHours] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingHours, setPendingHours] = useState(0);
  const [confirmPwd, setConfirmPwd] = useState("");

  // 1. Re-sync timer from Supabase on load/refresh
  useEffect(() => {
    const syncTimer = async () => {
      const { data } = await supabase
        .from('active_sessions')
        .select('end_time, is_active')
        .eq('station_id', stationNumber)
        .single();

      if (data?.is_active) {
        const remaining = Math.floor((new Date(data.end_time) - new Date()) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsActive(true);
        } else {
          // If time passed while away, clean up the database
          await supabase.from('active_sessions').update({ is_active: false }).eq('station_id', stationNumber);
        }
      }
    };
    syncTimer();
  }, [stationNumber]);

  // 2. Main countdown and session finalization
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      finalizeSession();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const finalizeSession = async () => {
    // Record the earnings and clear the active status
    await supabase.from('history').insert([{
      type: 'RENTAL',
      station: stationNumber,
      duration: pendingHours > 0 ? pendingHours : 1, // fallback
      earned: (pendingHours * 100).toFixed(2), // 100 MDL/hr
      timestamp: new Date().toISOString()
    }]);
    
    await supabase.from('active_sessions').update({ is_active: false }).eq('station_id', stationNumber);
  };

  const handleStartRequest = (hours) => {
    const h = parseFloat(hours);
    if (isNaN(h) || h <= 0) return alert("Enter valid hours");
    setPendingHours(h);
    setIsModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    if (confirmPwd === "123") {
      const endAt = new Date(Date.now() + pendingHours * 3600000).toISOString();
      
      const { error } = await supabase.from('active_sessions').upsert({
        station_id: stationNumber,
        end_time: endAt,
        is_active: true
      });

      if (!error) {
        setTimeLeft(Math.floor(pendingHours * 3600));
        setIsActive(true);
        setIsModalOpen(false);
        setConfirmPwd("");
        setCustomHours("");
      } else {
        alert("Database error: " + error.message);
      }
    } else {
      alert("Incorrect password!");
    }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div style={isActive ? styles.cardActive : styles.cardInactive}>
      <div style={styles.cardHeader}>
        <Monitor size={20} color={isActive ? '#4ade80' : '#888'} />
        <h3 style={{ margin: 0 }}>Station #{stationNumber}</h3>
      </div>

      {isActive ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.timer}>{formatTime(timeLeft)}</h2>
          <div style={styles.lockedBadge}><Lock size={12} /> Locked</div>
        </div>
      ) : (
        <div style={styles.controls}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[0.5, 1, 2].map(h => (
              <button key={h} onClick={() => handleStartRequest(h)} style={styles.quickBtn}>{h < 1 ? '30m' : h+'h'}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="number" placeholder="Hours" value={customHours}
              onChange={(e) => setCustomHours(e.target.value)} style={styles.input}
            />
            <button onClick={() => handleStartRequest(customHours)} style={styles.startBtn}><Play size={16} fill="white"/></button>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isModalOpen}
        title="Start Session"
        message={`Start PS5 #${stationNumber} for ${pendingHours} hours?`}
        pwd={confirmPwd} setPwd={setConfirmPwd}
        onConfirm={handleFinalConfirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// --- Styles ---
const styles = {
  cardInactive: { border: '1px solid #333', borderRadius: '12px', padding: '20px', backgroundColor: '#1a1a1a', color: 'white', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardActive: { border: '1px solid #333', borderRadius: '12px', padding: '20px', backgroundColor: '#064e3b', color: 'white', height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  timer: { fontSize: '1.8rem', margin: '15px 0', fontFamily: 'monospace' },
  lockedBadge: { color: '#888', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
  controls: { display: 'flex', flexDirection: 'column', gap: '10px' },
  quickBtn: { flex: 1, padding: '8px', backgroundColor: '#333', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' },
  input: { flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#000', color: 'white' },
  startBtn: { padding: '8px 15px', backgroundColor: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 },
  modalBox: { backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '350px', textAlign: 'center', color: 'white' },
  modalInput: { width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#000', color: 'white', textAlign: 'center' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  confirmBtn: { padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default PS5Card;