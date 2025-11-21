import React from 'react';

const ModeSelect = ({ onSelectMode }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: 'bold', 
          marginBottom: '40px', 
          background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          fontFamily: 'serif' 
        }}>
          Blackjack
        </h1>
        <div style={{ 
          fontSize: '32px', 
          color: '#fcd34d', 
          marginBottom: '60px', 
          fontWeight: 'bold' 
        }}>
          Select Number of Players
        </div>
        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
          <button 
            onClick={() => onSelectMode(1)} 
            style={{ 
              padding: '24px 48px', 
              borderRadius: '16px', 
              fontWeight: 'bold', 
              fontSize: '28px', 
              color: 'white', 
              background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' 
            }}
          >
            Solo
          </button>
          <button 
            onClick={() => onSelectMode(2)} 
            style={{ 
              padding: '24px 48px', 
              borderRadius: '16px', 
              fontWeight: 'bold', 
              fontSize: '28px', 
              color: 'white', 
              background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' 
            }}
          >
            2 Players
          </button>
          <button 
            onClick={() => onSelectMode(3)} 
            style={{ 
              padding: '24px 48px', 
              borderRadius: '16px', 
              fontWeight: 'bold', 
              fontSize: '28px', 
              color: 'white', 
              background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' 
            }}
          >
            3 Players
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelect;