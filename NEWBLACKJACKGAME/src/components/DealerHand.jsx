import React from 'react';
import Card from './Card';
import { calculateScore } from '../utils/cardUtils';

const DealerHand = ({ dealerHand, dealerScore, gameState }) => {
  // Show only first card's value during betting and playing phases
  const displayScore = (gameState === 'playing' || gameState === 'betting') && dealerHand.length > 0
    ? calculateScore([dealerHand[0]])
    : dealerScore;

  return (
    <div style={{ marginBottom: '64px', textAlign: 'center' }}>
      <div style={{ 
        display: 'inline-block', 
        background: 'rgba(0,0,0,0.4)', 
        padding: '8px 24px', 
        borderRadius: '9999px' 
      }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Dealer</div>
        <div style={{ color: '#fcd34d', fontSize: '20px' }}>Value: {displayScore}</div>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginTop: '16px', 
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