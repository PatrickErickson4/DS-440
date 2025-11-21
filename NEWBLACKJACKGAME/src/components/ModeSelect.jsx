import React from 'react';

const ModeSelect = ({ onSelectMode }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ 
          fontSize: 'clamp(36px, 10vw, 72px)', 
          fontWeight: 'bold', 
          marginBottom: 'clamp(20px, 5vw, 40px)', 
          background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          fontFamily: 'serif' 
        }}>
          Blackjack
        </h1>
        <div style={{ 
          fontSize: 'clamp(18px, 4vw, 32px)', 
          color: '#fcd34d', 
          marginBottom: 'clamp(30px, 8vw, 60px)', 
          fontWeight: 'bold' 
        }}>
          Select Number of Players
        </div>
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(16px, 4vw, 40px)', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => onSelectMode(1)} 
            style={{ 
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', 
              borderRadius: 'clamp(12px, 2vw, 16px)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 3.5vw, 28px)', 
              color: 'white', 
              background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              minWidth: 'clamp(100px, 25vw, 150px)'
            }}
          >
            Solo
          </button>
          <button 
            onClick={() => onSelectMode(2)} 
            style={{ 
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', 
              borderRadius: 'clamp(12px, 2vw, 16px)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 3.5vw, 28px)', 
              color: 'white', 
              background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              minWidth: 'clamp(100px, 25vw, 150px)'
            }}
          >
            2 Players
          </button>
          <button 
            onClick={() => onSelectMode(3)} 
            style={{ 
              padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', 
              borderRadius: 'clamp(12px, 2vw, 16px)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(18px, 3.5vw, 28px)', 
              color: 'white', 
              background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', 
              border: '3px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              minWidth: 'clamp(100px, 25vw, 150px)'
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