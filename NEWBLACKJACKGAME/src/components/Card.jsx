import React from 'react';
import { getSuitColor } from '../utils/cardUtils';

const Card = ({ card, hidden }) => {
  const cardStyle = { 
    width: 'clamp(60px, 15vw, 96px)', 
    height: 'clamp(90px, 22.5vw, 144px)', 
    borderRadius: 'clamp(4px, 1vw, 8px)', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 'clamp(4px, 1vw, 8px)',
    background: hidden ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' : '#ffffff', 
    border: '2px solid rgba(255,255,255,0.3)', 
    color: hidden ? '#ffffff' : getSuitColor(card.suit)
  };

  return (
    <div style={cardStyle}>
      {hidden ? (
        <div style={{ fontSize: 'clamp(30px, 8vw, 60px)', opacity: 0.3 }}>?</div>
      ) : (
        <>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 24px)', fontWeight: 'bold' }}>{card.value}</div>
          <div style={{ fontSize: 'clamp(24px, 6vw, 48px)' }}>{card.suit}</div>
          <div style={{ fontSize: 'clamp(14px, 3.5vw, 24px)', fontWeight: 'bold', transform: 'rotate(180deg)' }}>
            {card.value}
          </div>
        </>
      )}
    </div>
  );
};

export default Card;