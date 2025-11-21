import React from 'react';
import { values } from '../utils/cardUtils';

const CardCounter = ({ groupedCounts }) => {
  return (
    <div 
      className="card-counter"
      style={{ 
        position: 'fixed', 
        bottom: 'clamp(8px, 2vw, 16px)', 
        left: 'clamp(8px, 2vw, 16px)', 
        background: 'rgba(0,0,0,0.9)', 
        borderRadius: 'clamp(8px, 1.5vw, 12px)', 
        padding: 'clamp(8px, 1.5vw, 12px)', 
        border: '2px solid #fbbf24', 
        width: 'clamp(150px, 25vw, 200px)'
      }}
    >
      <div style={{ 
        color: '#ffd700', 
        fontSize: 'clamp(11px, 1.8vw, 14px)', 
        fontWeight: 'bold', 
        marginBottom: 'clamp(4px, 1vw, 6px)', 
        textAlign: 'center' 
      }}>
        Card Counter
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 'clamp(2px, 0.5vw, 4px)' 
      }}>
        {values.map(value => (
          <div 
            key={value} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: 'clamp(4px, 0.8vw, 6px)', 
              padding: 'clamp(2px, 0.5vw, 4px)', 
              textAlign: 'center' 
            }}
          >
            <div style={{ 
              color: 'white', 
              fontSize: 'clamp(9px, 1.5vw, 12px)', 
              fontWeight: 'bold', 
              marginBottom: 'clamp(1px, 0.3vw, 2px)' 
            }}>
              {value}
            </div>
            <div style={{ color: '#22c55e', fontSize: 'clamp(7px, 1.2vw, 9px)' }}>
              {groupedCounts[value].remaining}
            </div>
            <div style={{ color: '#ef4444', fontSize: 'clamp(7px, 1.2vw, 9px)' }}>
              {groupedCounts[value].dealt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCounter;