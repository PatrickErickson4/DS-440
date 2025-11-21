import React from 'react';
import { values } from '../utils/cardUtils';

const CardCounter = ({ groupedCounts }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '16px', 
      left: '16px', 
      background: 'rgba(0,0,0,0.9)', 
      borderRadius: '12px', 
      padding: '12px', 
      border: '2px solid #fbbf24', 
      width: '200px' 
    }}>
      <div style={{ 
        color: '#ffd700', 
        fontSize: '14px', 
        fontWeight: 'bold', 
        marginBottom: '6px', 
        textAlign: 'center' 
      }}>
        Card Counter
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '4px' 
      }}>
        {values.map(value => (
          <div 
            key={value} 
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '4px', 
              textAlign: 'center' 
            }}
          >
            <div style={{ 
              color: 'white', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              marginBottom: '2px' 
            }}>
              {value}
            </div>
            <div style={{ color: '#22c55e', fontSize: '9px' }}>
              {groupedCounts[value].remaining}
            </div>
            <div style={{ color: '#ef4444', fontSize: '9px' }}>
              {groupedCounts[value].dealt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCounter;