import React from 'react';
import { getSuitColor } from '../utils/cardUtils';

const Card = ({ card, hidden }) => {
  const cardStyle = { 
    width: '96px', 
    height: '144px', 
    borderRadius: '8px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '8px',
    background: hidden ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' : '#ffffff', 
    border: '3px solid rgba(255,255,255,0.3)', 
    color: hidden ? '#ffffff' : getSuitColor(card.suit)
  };

  return (
    <div style={cardStyle}>
      {hidden ? (
        <div style={{ fontSize: '60px', opacity: 0.3 }}>?</div>
      ) : (
        <>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.value}</div>
          <div style={{ fontSize: '48px' }}>{card.suit}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', transform: 'rotate(180deg)' }}>
            {card.value}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;