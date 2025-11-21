import React from 'react';

const AISelect = ({ numPlayers, selectedAIStyles, setSelectedAIStyles, onConfirm, onBack }) => {
  const AIStyleButton = ({ playerKey, style, label, emoji }) => {
    const isSelected = selectedAIStyles[playerKey] === style;
    
    const colorMap = {
      aggressive: { from: '#dc2626', to: '#991b1b', alpha: 'rgba(220, 38, 38, 0.3)' },
      optimal: { from: '#8b5cf6', to: '#7c3aed', alpha: 'rgba(139, 92, 246, 0.3)' },
      safe: { from: '#2563eb', to: '#1e40af', alpha: 'rgba(37, 99, 235, 0.3)' },
      random: { from: '#ec4899', to: '#be185d', alpha: 'rgba(236, 72, 153, 0.3)' }
    };
    
    const colors = colorMap[style];
    
    return (
      <button 
        onClick={() => setSelectedAIStyles({...selectedAIStyles, [playerKey]: style})} 
        style={{ 
          padding: '16px 32px', 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          fontSize: '20px', 
          color: 'white', 
          background: isSelected ? `linear-gradient(180deg, ${colors.from} 0%, ${colors.to} 100%)` : colors.alpha, 
          border: isSelected ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', 
          cursor: 'pointer' 
        }}
      >
        {emoji} {label}
      </button>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)' 
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '40px' }}>
        <h1 style={{ 
          fontSize: '60px', 
          fontWeight: 'bold', 
          marginBottom: '20px', 
          background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          fontFamily: 'serif' 
        }}>
          Configure AI Players
        </h1>
        <div style={{ fontSize: '20px', color: '#fcd34d', marginBottom: '40px' }}>
          You control Player 1. Select play styles for AI players:
        </div>
        
        {numPlayers >= 2 && (
          <div style={{ 
            background: 'rgba(0,0,0,0.6)', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '24px', 
            border: '2px solid #fbbf24' 
          }}>
            <div style={{ fontSize: '24px', color: 'white', marginBottom: '16px', fontWeight: 'bold' }}>
              Player 2 (AI)
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <AIStyleButton playerKey="player2" style="aggressive" label="Aggressive" emoji="🔥" />
              <AIStyleButton playerKey="player2" style="optimal" label="Optimal" emoji="⭐" />
              <AIStyleButton playerKey="player2" style="safe" label="Safe" emoji="🛡️" />
              <AIStyleButton playerKey="player2" style="random" label="Random" emoji="🎲" />
            </div>
          </div>
        )}
        
        {numPlayers >= 3 && (
          <div style={{ 
            background: 'rgba(0,0,0,0.6)', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '24px', 
            border: '2px solid #fbbf24' 
          }}>
            <div style={{ fontSize: '24px', color: 'white', marginBottom: '16px', fontWeight: 'bold' }}>
              Player 3 (AI)
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <AIStyleButton playerKey="player3" style="aggressive" label="Aggressive" emoji="🔥" />
              <AIStyleButton playerKey="player3" style="optimal" label="Optimal" emoji="⭐" />
              <AIStyleButton playerKey="player3" style="safe" label="Safe" emoji="🛡️" />
              <AIStyleButton playerKey="player3" style="random" label="Random" emoji="🎲" />
            </div>
          </div>
        )}
        
        <button 
          onClick={onConfirm} 
          disabled={(numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)} 
          style={{ 
            padding: '20px 48px', 
            borderRadius: '16px', 
            fontWeight: 'bold', 
            fontSize: '24px', 
            color: 'white', 
            background: ((numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)) 
              ? 'rgba(128,128,128,0.5)' 
              : 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', 
            border: '3px solid rgba(255,255,255,0.3)', 
            cursor: ((numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)) 
              ? 'not-allowed' 
              : 'pointer', 
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', 
            marginTop: '32px' 
          }}
        >
          Start Game
        </button>
        <button 
          onClick={onBack} 
          style={{ 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontWeight: 'bold', 
            fontSize: '16px', 
            color: 'white', 
            background: 'rgba(128,128,128,0.5)', 
            border: '2px solid rgba(255,255,255,0.3)', 
            cursor: 'pointer', 
            marginTop: '16px', 
            marginLeft: '16px' 
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AISelect;