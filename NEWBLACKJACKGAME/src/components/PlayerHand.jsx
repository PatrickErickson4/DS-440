import React from 'react';
import Card from './Card';

const PlayerHand = ({ player, isActive, gameState }) => {
  const getAIStyleDisplay = (aiStyle) => {
    const styles = {
      aggressive: { emoji: '🔥', label: 'Aggressive AI', color: '#ef4444' },
      optimal: { emoji: '⭐', label: 'Optimal AI', color: '#a78bfa' },
      safe: { emoji: '🛡️', label: 'Safe AI', color: '#3b82f6' },
      random: { emoji: '🎲', label: 'Random AI', color: '#ec4899' }
    };
    return styles[aiStyle] || styles.safe;
  };

  const aiStyleInfo = player.isAI && player.aiStyle ? getAIStyleDisplay(player.aiStyle) : null;

  return (
    <div style={{ 
      background: isActive && (gameState === 'playing' || gameState === 'betting') 
        ? 'rgba(255, 215, 0, 0.1)' 
        : 'transparent', 
      borderRadius: '16px', 
      padding: '16px', 
      border: isActive && (gameState === 'playing' || gameState === 'betting') 
        ? '2px solid #ffd700' 
        : 'none' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ 
          display: 'inline-block', 
          background: 'rgba(0,0,0,0.4)', 
          padding: '8px 16px', 
          borderRadius: '9999px' 
        }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            {player.name}
          </div>
          {aiStyleInfo && (
            <div style={{ 
              color: aiStyleInfo.color, 
              fontSize: '14px', 
              fontStyle: 'italic', 
              marginTop: '4px' 
            }}>
              {aiStyleInfo.emoji} {aiStyleInfo.label}
            </div>
          )}
          <div style={{ color: '#fcd34d', fontSize: '16px' }}>Score: {player.score}</div>
          <div style={{ color: '#22c55e', fontSize: '14px' }}>Chips: ${player.chips}</div>
          {player.bet > 0 && (
            <div style={{ color: '#ef4444', fontSize: '14px' }}>Bet: ${player.bet}</div>
          )}
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        flexWrap: 'wrap' 
      }}>
        {player.hand.map((card, i) => (
          <Card key={i} card={card} />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;