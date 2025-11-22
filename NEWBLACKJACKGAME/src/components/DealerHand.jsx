import React from 'react';
import Card from './Card';
import { calculateScore } from '../utils/cardUtils';

const DealerHand = ({ dealerHand, dealerScore, gameState }) => {
  // Show only first card's value during betting and playing phases
  const displayScore = (gameState === 'playing' || gameState === 'betting') && dealerHand.length > 0
    ? calculateScore([dealerHand[0]])
    : dealerScore;

  return (
    <div style={{ marginBottom: 'clamp(32px, 8vw, 64px)', textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-block', 
        background: 'rgba(0,0,0,0.4)', 
        padding: 'clamp(6px, 1vw, 8px) clamp(12px, 2vw, 24px)', 
        borderRadius: '9999px' 
      }}>
        <div style={{ color: 'white', fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 'bold' }}>Dealer</div>
        <div style={{ color: '#fcd34d', fontSize: 'clamp(14px, 2.5vw, 20px)' }}>Value: {displayScore}</div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 'clamp(8px, 1.5vw, 12px)', 
        marginTop: 'clamp(12px, 2vw, 16px)', 
        flexWrap: 'wrap' 
      }}>
        {dealerHand.map((card, i) => (
          <Card 
            key={i} 
            card={card} 
            hidden={i === 1 && (gameState === 'playing' || gameState === 'betting')} 
          />
        ))}
      </div>
    </div>
  );
};

export default DealerHand;