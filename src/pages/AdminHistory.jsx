import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHistory = () => {
  const navigate = useNavigate();
  
  const history = [
    { id: 1, station: 1, duration: '2h', earned: '$15.00', time: '12:30 PM' },
    { id: 2, station: 4, duration: '1h', earned: '$8.00', time: '01:45 PM' },
  ];

  return (
    <div style={fullScreenContainer}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0 }}>Admin Revenue Logs</h1>
        <button onClick={() => navigate('/')} style={logoutBtn}>Logout</button>
      </header>

      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={th}>Time</th>
              <th style={th}>PS Station</th>
              <th style={th}>Duration</th>
              <th style={th}>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={td}>{item.time}</td>
                <td style={td}>Station #{item.station}</td>
                <td style={td}>{item.duration}</td>
                <td style={{ ...td, color: '#4ade80', fontWeight: 'bold' }}>{item.earned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <h2 style={{ marginTop: '50px', marginBottom: '20px' }}>Staff Shift Logs</h2>
        <div style={tableWrapper}>
        <table style={tableStyle}>
            <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={th}>Date</th>
                <th style={th}>Cashier Name</th>
                <th style={th}>Hours Worked</th>
            </tr>
            </thead>
            <tbody>
            {/* Example data - this will eventually come from your backend */}
            <tr style={{ borderBottom: '1px solid #222' }}>
                <td style={td}>2026-02-13</td>
                <td style={td}>Sergiu</td>
                <td style={td}>8.50 hours</td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
  );
};

const fullScreenContainer = { 
  width: '100vw', 
  minHeight: '100vh', 
  backgroundColor: '#0f0f0f', 
  color: 'white', 
  boxSizing: 'border-box',
  padding: '40px' 
};

const headerStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: '40px',
  width: '100%'
};

const tableWrapper = { width: '100%', overflowX: 'auto' };

const tableStyle = { 
  width: '100%', 
  borderCollapse: 'collapse', 
  backgroundColor: '#161616', 
  borderRadius: '8px',
  fontSize: '1.1rem'
};

const th = { padding: '20px', textAlign: 'left', color: '#888', borderBottom: '1px solid #333' };
const td = { padding: '20px' };
const logoutBtn = { padding: '10px 20px', backgroundColor: '#333', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' };

export default AdminHistory;