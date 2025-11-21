import React from 'react';

const MistakeLog = ({ mistakes, onClose }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0, 0, 0, 0.7)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        background: 'linear-gradient(180deg, #1a0505 0%, #4a0e0e 100%)', 
        borderRadius: '16px', 
        border: '3px solid #fbbf24', 
        padding: '32px', 
        maxWidth: '600px', 
        maxHeight: '80vh', 
        overflow: 'auto', 
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ 
            color: '#ffd700', 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0 
          }}>
            📋 Mistake Log
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', 
              color: 'white', 
              fontSize: '24px', 
              cursor: 'pointer', 
              borderRadius: '8px', 
              width: '40px', 
              height: '40px' 
            }}
          >
            ×
          </button>
        </div>
        
        {mistakes.length === 0 ? (
          <div style={{ 
            color: '#22c55e', 
            fontSize: '18px', 
            textAlign: 'center', 
            padding: '32px' 
          }}>
            ✓ No mistakes so far! Keep playing optimally!
          </div>
        ) : (
          <div>
            <div style={{ 
              color: '#fcd34d', 
              fontSize: '14px', 
              marginBottom: '16px', 
              fontWeight: 'bold' 
            }}>
              Total Mistakes: {mistakes.length}
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}>
              {mistakes.map((mistake, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    border: '2px solid #ef4444', 
                    borderRadius: '12px', 
                    padding: '16px' 
                  }}
                >
                  <div style={{ 
                    color: '#ef4444', 
                    fontSize: '14px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px' 
                  }}>
                    Mistake #{idx + 1} - {mistake.timestamp}
                  </div>
                  <div style={{ 
                    color: '#fcd34d', 
                    fontSize: '13px', 
                    marginBottom: '4px' 
                  }}>
                    Your Hand: {mistake.hand}
                  </div>
                  <div style={{ 
                    color: '#fcd34d', 
                    fontSize: '13px', 
                    marginBottom: '4px' 
                  }}>
                    Your Score: {mistake.score} {mistake.soft ? '(soft)' : '(hard)'}
                  </div>
                  <div style={{ 
                    color: '#fcd34d', 
                    fontSize: '13px', 
                    marginBottom: '8px' 
                  }}>
                    Dealer: {mistake.dealerCard}
                  </div>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '8px' 
                  }}>
                    <div style={{ 
                      color: '#ef4444', 
                      fontSize: '12px', 
                      marginBottom: '4px' 
                    }}>
                      ❌ You played: <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                        {mistake.playerAction}
                      </span>
                    </div>
                    <div style={{ 
                      color: '#22c55e', 
                      fontSize: '12px', 
                      marginBottom: '4px' 
                    }}>
                      ✓ Optimal play: <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
                        {mistake.optimalAction}
                      </span>
                    </div>
                    <div style={{ 
                      color: '#a78bfa', 
                      fontSize: '12px', 
                      fontStyle: 'italic', 
                      marginTop: '8px' 
                    }}>
                      💡 {mistake.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakeLog;