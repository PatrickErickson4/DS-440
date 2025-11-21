import React from 'react';

const SideBets = ({ 
  gameState, 
  currentPlayer, 
  pairBet, 
  hot3Bet, 
  pairBetOutcome, 
  hot3BetOutcome,
  onPlacePairBet, 
  onPlaceHot3Bet,
  playerChips 
}) => {
  // Only show betting UI during betting phase for human player
  if (gameState === 'betting' && currentPlayer === 0) {
    return (
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          background: 'rgba(139, 92, 246, 0.2)', 
          border: '2px solid #8b5cf6', 
          borderRadius: '16px', 
          padding: '20px 32px' 
        }}>
          <div style={{ 
            color: '#a78bfa', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px' 
          }}>
            💎 Side Bets
          </div>
          
          {/* Pair Bet Section */}
          <div style={{ 
            marginBottom: '20px', 
            paddingBottom: '20px', 
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)' 
          }}>
            <div style={{ 
              color: '#fcd34d', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              🃏 Pair Bet
            </div>
            <div style={{ 
              color: '#fcd34d', 
              fontSize: '12px', 
              marginBottom: '12px' 
            }}>
              Same rank: 5:1 | Suited pair: 20:1
            </div>
            {pairBet === 0 ? (
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center', 
                flexWrap: 'wrap' 
              }}>
                {[5, 10, 25].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => onPlacePairBet(amount)} 
                    disabled={playerChips < amount} 
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      fontWeight: 'bold', 
                      fontSize: '13px', 
                      color: 'white', 
                      background: playerChips < amount 
                        ? 'rgba(139, 92, 246, 0.3)' 
                        : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      cursor: playerChips < amount ? 'not-allowed' : 'pointer', 
                      opacity: playerChips < amount ? 0.5 : 1 
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ 
                color: '#a78bfa', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}>
                Pair: ${pairBet} ✓
              </div>
            )}
          </div>

          {/* Hot 3 Bet Section */}
          <div>
            <div style={{ 
              color: '#fcd34d', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginBottom: '8px' 
            }}>
              🔥 Hot 3 Bet
            </div>
            <div style={{ 
              color: '#fcd34d', 
              fontSize: '11px', 
              marginBottom: '12px', 
              lineHeight: '1.4' 
            }}>
              Ex. Three 7s: 100:1 | Suited 21: 20:1 | 21: 4:1<br/>20: 2:1 | 19: 1:1
            </div>
            {hot3Bet === 0 ? (
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center', 
                flexWrap: 'wrap' 
              }}>
                {[5, 10, 25].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => onPlaceHot3Bet(amount)} 
                    disabled={playerChips < amount} 
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      fontWeight: 'bold', 
                      fontSize: '13px', 
                      color: 'white', 
                      background: playerChips < amount 
                        ? 'rgba(239, 68, 68, 0.3)' 
                        : 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      cursor: playerChips < amount ? 'not-allowed' : 'pointer', 
                      opacity: playerChips < amount ? 0.5 : 1 
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}>
                Hot 3: ${hot3Bet} ✓
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show outcomes during playing phase
  if (gameState === 'playing' && (pairBetOutcome || hot3BetOutcome)) {
    return (
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center', 
          flexWrap: 'wrap' 
        }}>
          {/* Pair Bet Outcome */}
          {pairBetOutcome && (
            <div style={{ 
              display: 'inline-block', 
              background: pairBetOutcome.won 
                ? 'rgba(34, 197, 94, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)', 
              border: pairBetOutcome.won 
                ? '2px solid #22c55e' 
                : '2px solid #ef4444', 
              borderRadius: '12px', 
              padding: '16px 24px', 
              minWidth: '200px' 
            }}>
              <div style={{ 
                color: pairBetOutcome.won ? '#22c55e' : '#ef4444', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '8px' 
              }}>
                {pairBetOutcome.won ? '🃏 Pair WON!' : '❌ Pair Lost'}
              </div>
              <div style={{ color: '#fcd34d', fontSize: '13px' }}>
                {pairBetOutcome.type}
                {pairBetOutcome.won && ` - $${pairBetOutcome.payout}`}
              </div>
            </div>
          )}
          
          {/* Hot 3 Bet Outcome */}
          {hot3BetOutcome && (
            <div style={{ 
              display: 'inline-block', 
              background: hot3BetOutcome.won 
                ? 'rgba(34, 197, 94, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)', 
              border: hot3BetOutcome.won 
                ? '2px solid #22c55e' 
                : '2px solid #ef4444', 
              borderRadius: '12px', 
              padding: '16px 24px', 
              minWidth: '200px' 
            }}>
              <div style={{ 
                color: hot3BetOutcome.won ? '#22c55e' : '#ef4444', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginBottom: '8px' 
              }}>
                {hot3BetOutcome.won ? '🔥 Hot 3 WON!' : '❌ Hot 3 Lost'}
              </div>
              <div style={{ color: '#fcd34d', fontSize: '13px' }}>
                {hot3BetOutcome.type}
                {hot3BetOutcome.won && ` - $${hot3BetOutcome.payout}`}
              </div>
              <div style={{ 
                color: '#a78bfa', 
                fontSize: '11px', 
                marginTop: '4px' 
              }}>
                Total: {hot3BetOutcome.total}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SideBets;