import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminHistory = () => {
  const navigate = useNavigate();
  const [activeStaff, setActiveStaff] = useState([]);
  const [activePS5s, setActivePS5s] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchData();

    // Real-time subscription to update the dashboard instantly
    const subscription = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchData = async () => {
    const { data: staff } = await supabase.from('profiles').select('*').eq('is_online', true);
    const { data: ps5s } = await supabase.from('active_sessions').select('*').eq('is_active', true);
    const { data: logs } = await supabase.from('history').select('*').order('timestamp', { ascending: false });

    setActiveStaff(staff || []);
    setActivePS5s(ps5s || []);
    setHistory(logs || []);
  };

  const rentals = history.filter(item => item.type === 'RENTAL');
  const shifts = history.filter(item => item.type === 'SHIFT');
  const totalProfit = rentals.reduce((sum, item) => sum + (parseFloat(item.earned) || 0), 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={{ color: '#4ade80', margin: 0 }}>● Live Cafe Status</h1>
          <p style={{ color: '#888' }}>Total Revenue: <strong style={{ color: '#4ade80' }}>{totalProfit.toFixed(2)} MDL</strong></p>
        </div>
        <button onClick={() => navigate('/')} style={styles.logoutBtn}>Exit Admin</button>
      </header>
      
      <div style={styles.liveGrid}>
        <div style={styles.statusCard}>
          <h3 style={styles.cardTitle}>Staff Online</h3>
          {activeStaff.length > 0 ? (
            activeStaff.map(s => <p key={s.id} style={styles.liveText}>🟢 {s.username}</p>)
          ) : (
            <p style={styles.emptyText}>No one logged in</p>
          )}
        </div>

        <div style={styles.statusCard}>
          <h3 style={styles.cardTitle}>Active Stations</h3>
          {activePS5s.length > 0 ? (
            activePS5s.map(p => (
              <p key={p.id} style={styles.liveText}>
                PS5 #{p.station_id} <span style={styles.timeLabel}>Ends {new Date(p.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </p>
            ))
          ) : (
            <p style={styles.emptyText}>All stations are free</p>
          )}
        </div>
      </div>

      <hr style={styles.divider} />

      <div style={styles.historyGrid}>
        {/* Rental History */}
        <div>
          <h2 style={styles.sectionTitle}>PS5 Revenue History</h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Station</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Earned</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(log => (
                  <tr key={log.id}>
                    <td style={styles.td}>PS5 #{log.station}</td>
                    <td style={styles.td}>{log.duration}h</td>
                    <td style={{ ...styles.td, color: '#4ade80' }}>{log.earned} MDL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift History */}
        <div>
          <h2 style={styles.sectionTitle}>Staff Shift Logs</h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Staff</th>
                  <th style={styles.th}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map(shift => (
                  <tr key={shift.id}>
                    <td style={styles.td}>{new Date(shift.timestamp).toLocaleDateString()}</td>
                    <td style={styles.td}>{shift.staff_name}</td>
                    <td style={styles.td}>{shift.duration}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Single Styles Object ---
const styles = {
  container: { padding: '40px', backgroundColor: '#0f0f0f', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  logoutBtn: { padding: '10px 20px', backgroundColor: '#333', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' },
  liveGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
  statusCard: { flex: 1, backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '12px', border: '1px solid #333' },
  cardTitle: { marginTop: 0, fontSize: '1.1rem', color: '#888', marginBottom: '15px' },
  liveText: { margin: '8px 0', fontSize: '1.1rem', fontWeight: '500' },
  timeLabel: { color: '#888', fontSize: '0.9rem', marginLeft: '10px' },
  emptyText: { color: '#555', fontStyle: 'italic' },
  divider: { borderColor: '#222', margin: '40px 0', borderStyle: 'solid' },
  historyGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  sectionTitle: { fontSize: '1.2rem', marginBottom: '20px' },
  tableCard: { backgroundColor: '#161616', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', backgroundColor: '#111', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '15px', borderBottom: '1px solid #222' }
};

export default AdminHistory;