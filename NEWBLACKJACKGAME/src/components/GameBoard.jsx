import React from 'react';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import SideBets from './SideBets';
import MistakeLog from './MistakeLog';
import CardCounter from './CardCounter';
import { 
  createDeck, 
  dealCard, 
  calculateScore, 
  getCardCount, 
  getGroupedCardCounts 
} from '../utils/cardUtils';
import { 
  getAIDecision, 
  getRuleBasedDecision, 
  checkForMistake, 
  getAIBetAmount 
} from '../utils/aiUtils';
import { evaluatePairBet, evaluateHot3Bet } from '../utils/sideBetUtils';

const GameBoard = ({
  gameState,
  setGameState,
  message,
  setMessage,
  deck,
  setDeck,
  dealtCards,
  setDealtCards,
  players,
  setPlayers,
  numPlayers,
  currentPlayer,
  setCurrentPlayer,
  dealerHand,
  setDealerHand,
  dealerScore,
  setDealerScore,
  aiThinking,
  setAiThinking,
  aiExplanation,
  setAiExplanation,
  mistakes,
  setMistakes,
  showMistakeLog,
  setShowMistakeLog,
  bestMoveRecommendation,
  setBestMoveRecommendation,
  pairBet,
  setPairBet,
  pairBetOutcome,
  setPairBetOutcome,
  hot3Bet,
  setHot3Bet,
  hot3BetOutcome,
  setHot3BetOutcome,
  onEndGame,
  onNewRound
}) => {
  
  // Side bet placement handlers
  const placePairBet = (amount) => {
    const player = players[0];
    
    if (amount > player.chips) {
      setMessage('Not enough chips for Pair bet!');
      return;
    }

    const newPlayers = [...players];
    newPlayers[0].chips -= amount;
    setPlayers(newPlayers);
    setPairBet(amount);
    setMessage(`Pair bet placed: $${amount}`);
  };

  const placeHot3Bet = (amount) => {
    const player = players[0];
    
    if (amount > player.chips) {
      setMessage('Not enough chips for Hot 3 bet!');
      return;
    }

    const newPlayers = [...players];
    newPlayers[0].chips -= amount;
    setPlayers(newPlayers);
    setHot3Bet(amount);
    setMessage(`Hot 3 bet placed: $${amount}`);
  };

  // AI turn handler
  const handleAITurn = async (currentPlayers, playerIndex, currentDeck, currentDealtCards, currentDealerHand) => {
    const player = currentPlayers[playerIndex];
    setAiThinking(true);
    setCurrentPlayer(playerIndex);
    setMessage(`${player.name} is thinking...`);
    
    const decision = await getAIDecision(
      player.hand,
      currentDealerHand[0],
      player.chips,
      player.bet,
      player.aiStyle,
      player.name
    );
    
    setAiExplanation(`${player.name}: ${decision.reason}`);
    
    setTimeout(() => {
      setAiThinking(false);
      setAiExplanation('');
      
      if (decision.action === 'HIT') {
        hit(playerIndex);
      } else if (decision.action === 'DOUBLE') {
        doubleDown(playerIndex);
      } else {
        stand(playerIndex);
      }
    }, 2000);
  };

  // Betting logic
  const placeBet = (amount) => {
    const player = players[currentPlayer];
    
    if (!player.isAI && amount > player.chips) {
      setMessage('Not enough chips!');
      return;
    }

    const newPlayers = [...players];
    newPlayers[currentPlayer].chips -= amount;
    newPlayers[currentPlayer].bet = amount;
    setPlayers(newPlayers);

    if (currentPlayer < numPlayers - 1) {
      const nextPlayerIndex = currentPlayer + 1;
      
      setTimeout(() => {
        setCurrentPlayer(nextPlayerIndex);
        setMessage(`${newPlayers[nextPlayerIndex].name}, place your bet`);
        
        if (newPlayers[nextPlayerIndex].isAI) {
          setTimeout(() => {
            const aiBet = getAIBetAmount(newPlayers[nextPlayerIndex]);
            const finalBet = Math.min(aiBet, newPlayers[nextPlayerIndex].chips);
            
            const updatedPlayers = [...newPlayers];
            updatedPlayers[nextPlayerIndex].chips -= finalBet;
            updatedPlayers[nextPlayerIndex].bet = finalBet;
            setPlayers(updatedPlayers);
            
            if (nextPlayerIndex < numPlayers - 1) {
              const nextNext = nextPlayerIndex + 1;
              setTimeout(() => {
                setCurrentPlayer(nextNext);
                setMessage(`${updatedPlayers[nextNext].name}, place your bet`);
                
                if (updatedPlayers[nextNext].isAI) {
                  setTimeout(() => {
                    const aiBet2 = getAIBetAmount(updatedPlayers[nextNext]);
                    const finalBet2 = Math.min(aiBet2, updatedPlayers[nextNext].chips);
                    
                    updatedPlayers[nextNext].chips -= finalBet2;
                    updatedPlayers[nextNext].bet = finalBet2;
                    setPlayers([...updatedPlayers]);
                    
                    setTimeout(() => startGame(), 500);
                  }, 1000);
                }
              }, 500);
            } else {
              setTimeout(() => startGame(), 500);
            }
          }, 1000);
        }
      }, 100);
    } else {
      setTimeout(() => startGame(), 500);
    }
  };

  // Start game - deal initial cards
  const startGame = () => {
    let newDeck = [...deck];
    let newDealtCards = [...dealtCards];
    
    if (newDeck.length < 15) {
      newDeck = createDeck();
      newDealtCards = [];
    }

    const newPlayers = [...players];
    
    // Deal first card to each player
    for (let p = 0; p < numPlayers; p++) {
      const deal1 = dealCard(newDeck, newDealtCards);
      newDeck = deal1.newDeck;
      newDealtCards = deal1.newDealtCards;
      newPlayers[p].hand = [deal1.card];
    }

    // Deal first card to dealer
    const dealerDeal1 = dealCard(newDeck, newDealtCards);
    newDeck = dealerDeal1.newDeck;
    newDealtCards = dealerDeal1.newDealtCards;
    setDealerHand([dealerDeal1.card]);

    // Deal second card to each player
    for (let p = 0; p < numPlayers; p++) {
      const deal2 = dealCard(newDeck, newDealtCards);
      newDeck = deal2.newDeck;
      newDealtCards = deal2.newDealtCards;
      newPlayers[p].hand.push(deal2.card);
    }

    // Deal second card to dealer
    const dealerDeal2 = dealCard(newDeck, newDealtCards);
    newDeck = dealerDeal2.newDeck;
    newDealtCards = dealerDeal2.newDealtCards;
    setDealerHand([dealerDeal1.card, dealerDeal2.card]);

    // Calculate scores
    for (let p = 0; p < numPlayers; p++) {
      newPlayers[p].score = calculateScore(newPlayers[p].hand);
    }

    setDeck(newDeck);
    setDealtCards(newDealtCards);
    setPlayers(newPlayers);
    setDealerScore(calculateScore([dealerDeal1.card, dealerDeal2.card]));
    setCurrentPlayer(0);
    setGameState('playing');
    setMessage(`${newPlayers[0].name}'s turn`);
    setBestMoveRecommendation(null);
    
    // Evaluate side bets for Player 1
    const pairResult = evaluatePairBet(newPlayers[0].hand, pairBet);
    if (pairResult) {
      setPairBetOutcome(pairResult);
      if (pairResult.won) {
        newPlayers[0].chips += pairResult.totalReturn;
        setPlayers([...newPlayers]);
      }
    }
    
    const hot3Result = evaluateHot3Bet(newPlayers[0].hand, dealerDeal1.card, hot3Bet);
    if (hot3Result) {
      setHot3BetOutcome(hot3Result);
      if (hot3Result.won) {
        newPlayers[0].chips += hot3Result.totalReturn;
        setPlayers([...newPlayers]);
      }
    }
  };

  // Get best move recommendation
  const getBestMove = () => {
    if (players[0].hand.length === 0) return;
    
    const optimalDecision = getRuleBasedDecision(
      players[0].hand,
      dealerHand[0],
      players[0].chips,
      players[0].bet,
      'optimal'
    );
    
    setBestMoveRecommendation(optimalDecision);
  };

  // Player actions
  const hit = (playerIndex = null) => {
    const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
    
    // Check for mistake if Player 1 (human) is hitting
    if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
      const mistake = checkForMistake(
        players[actualPlayerIndex].hand, 
        dealerHand[0], 
        'HIT', 
        players[actualPlayerIndex].chips, 
        players[actualPlayerIndex].bet
      );
      if (mistake) setMistakes(prev => [...prev, mistake]);
    }
    
    const result = dealCard(deck, dealtCards);
    const newPlayers = [...players];
    newPlayers[actualPlayerIndex].hand.push(result.card);
    newPlayers[actualPlayerIndex].score = calculateScore(newPlayers[actualPlayerIndex].hand);

    setDeck(result.newDeck);
    setDealtCards(result.newDealtCards);
    setPlayers(newPlayers);
    setCurrentPlayer(actualPlayerIndex);

    if (newPlayers[actualPlayerIndex].score > 21) {
      setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          setMessage(`${newPlayers[nextIdx].name}'s turn`);
          if (newPlayers[nextIdx].isAI) {
            setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
          }
        } else {
          dealerTurn();
        }
      }, 1500);
    } else if (newPlayers[actualPlayerIndex].score === 21) {
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          setMessage(`${newPlayers[nextIdx].name}'s turn`);
          if (newPlayers[nextIdx].isAI) {
            setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
          }
        } else {
          dealerTurn();
        }
      }, 1000);
    } else if (newPlayers[actualPlayerIndex].isAI) {
      setTimeout(() => {
        handleAITurn(newPlayers, actualPlayerIndex, result.newDeck, result.newDealtCards, dealerHand);
      }, 500);
    }
  };

  const stand = (playerIndex = null) => {
    const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
    
    // Check for mistake if Player 1 (human) is standing
    if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
      const mistake = checkForMistake(
        players[actualPlayerIndex].hand, 
        dealerHand[0], 
        'STAND', 
        players[actualPlayerIndex].chips, 
        players[actualPlayerIndex].bet
      );
      if (mistake) setMistakes(prev => [...prev, mistake]);
    }
    
    if (actualPlayerIndex < numPlayers - 1) {
      const nextIdx = actualPlayerIndex + 1;
      setCurrentPlayer(nextIdx);
      setMessage(`${players[nextIdx].name}'s turn`);
      
      if (players[nextIdx].isAI) {
        setTimeout(() => {
          handleAITurn(players, nextIdx, deck, dealtCards, dealerHand);
        }, 1000);
      }
    } else {
      dealerTurn();
    }
  };

  const doubleDown = (playerIndex = null) => {
    const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
    const player = players[actualPlayerIndex];
    
    // Check for mistake if Player 1 (human) is doubling down
    if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
      const mistake = checkForMistake(
        players[actualPlayerIndex].hand, 
        dealerHand[0], 
        'DOUBLE', 
        players[actualPlayerIndex].chips, 
        players[actualPlayerIndex].bet
      );
      if (mistake) setMistakes(prev => [...prev, mistake]);
    }
    
    if (player.chips < player.bet) {
      setMessage('Not enough chips to double down!');
      return;
    }

    const result = dealCard(deck, dealtCards);
    const newPlayers = [...players];
    newPlayers[actualPlayerIndex].chips -= newPlayers[actualPlayerIndex].bet;
    newPlayers[actualPlayerIndex].bet *= 2;
    newPlayers[actualPlayerIndex].hand.push(result.card);
    newPlayers[actualPlayerIndex].score = calculateScore(newPlayers[actualPlayerIndex].hand);

    setDeck(result.newDeck);
    setDealtCards(result.newDealtCards);
    setPlayers(newPlayers);
    setCurrentPlayer(actualPlayerIndex);

    if (newPlayers[actualPlayerIndex].score > 21) {
      setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          setMessage(`${newPlayers[nextIdx].name}'s turn`);
          if (newPlayers[nextIdx].isAI) {
            setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
          }
        } else {
          dealerTurn();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          setMessage(`${newPlayers[nextIdx].name}'s turn`);
          if (newPlayers[nextIdx].isAI) {
            setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
          }
        } else {
          dealerTurn();
        }
      }, 500);
    }
  };

  // Dealer turn
  const dealerTurn = () => {
    setGameState('dealerTurn');
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];
    let newDealtCards = [...dealtCards];
    let dScore = calculateScore(newDealerHand);
    
    setTimeout(() => {
      while (dScore < 17) {
        const result = dealCard(newDeck, newDealtCards);
        newDealerHand.push(result.card);
        newDeck = result.newDeck;
        newDealtCards = result.newDealtCards;
        dScore = calculateScore(newDealerHand);
      }
      setDealerHand(newDealerHand);
      setDealerScore(dScore);
      setDeck(newDeck);
      setDealtCards(newDealtCards);
      determineWinners(dScore);
    }, 1000);
  };

  // Determine winners
  const determineWinners = (dScore) => {
    setGameState('gameOver');
    const newPlayers = [...players];
    let resultMsg = `Dealer: ${dScore}\n\n`;
    
    for (let p = 0; p < numPlayers; p++) {
      const pScore = newPlayers[p].score;
      const bet = newPlayers[p].bet;
      
      if (pScore > 21) {
        resultMsg += `${newPlayers[p].name}: BUST\n`;
      } else if (dScore > 21) {
        const winAmount = bet * 2;
        newPlayers[p].chips += bet + winAmount;
        resultMsg += `${newPlayers[p].name}: +$${winAmount}\n`;
      } else if (pScore > dScore) {
        const winAmount = bet * 2;
        newPlayers[p].chips += bet + winAmount;
        resultMsg += `${newPlayers[p].name}: +$${winAmount}\n`;
      } else if (pScore < dScore) {
        resultMsg += `${newPlayers[p].name}: Lost $${bet}\n`;
      } else {
        newPlayers[p].chips += bet;
        resultMsg += `${newPlayers[p].name}: Push\n`;
      }
    }
    setPlayers(newPlayers);
    setMessage(resultMsg);
  };

  const canDoubleDown = () => {
    return players[currentPlayer].hand.length === 2 && 
           players[currentPlayer].chips >= players[currentPlayer].bet;
  };

  // Calculate card counts for display
  const cardCounts = getCardCount(dealtCards);
  const groupedCounts = getGroupedCardCounts(cardCounts);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '16px', 
      background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)', 
      position: 'relative' 
    }}>
      <div style={{ width: '100%', maxWidth: '1400px' }}>
        {/* End Game Button */}
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button 
            onClick={onEndGame} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '16px', 
              color: 'white', 
              background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', 
              border: '2px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer' 
            }}
          >
            End Game
          </button>
        </div>
        
        {/* Mistake Log Button */}
        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
          <button 
            onClick={() => setShowMistakeLog(!showMistakeLog)} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '16px', 
              color: 'white', 
              background: mistakes.length > 0 
                ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)' 
                : 'rgba(245, 158, 11, 0.3)', 
              border: mistakes.length > 0 
                ? '2px solid #fbbf24' 
                : '2px solid rgba(255,255,255,0.3)', 
              cursor: 'pointer' 
            }}
          >
            📋 Mistakes ({mistakes.length})
          </button>
        </div>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '60px', 
            fontWeight: 'bold', 
            marginBottom: '8px', 
            background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontFamily: 'serif' 
          }}>
            Blackjack Table
          </h1>
          <div style={{ fontSize: '16px', color: '#fcd34d' }}>
            Cards: {deck.length} | Dealt: {dealtCards.length}
          </div>
        </div>
        
        {/* Game Table */}
        <div style={{ 
          borderRadius: '24px', 
          background: 'linear-gradient(180deg, #0a5c3a 0%, #064d2e 100%)', 
          border: '12px solid #4a1c1c', 
          padding: '48px' 
        }}>
          {/* Dealer Hand */}
          <DealerHand 
            dealerHand={dealerHand} 
            dealerScore={dealerScore} 
            gameState={gameState} 
          />
          
          {/* Message Display */}
          {message && (
            <div style={{ textAlign: 'center', margin: '32px 0' }}>
              <div style={{ 
                display: 'inline-block', 
                background: 'rgba(0,0,0,0.6)', 
                padding: '16px 32px', 
                borderRadius: '12px', 
                border: '2px solid #fbbf24' 
              }}>
                <div style={{ 
                  color: '#fcd34d', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  whiteSpace: 'pre-wrap' 
                }}>
                  {message}
                </div>
                {aiThinking && (
                  <div style={{ 
                    color: '#22c55e', 
                    fontSize: '14px', 
                    marginTop: '8px', 
                    fontStyle: 'italic' 
                  }}>
                    🤔 AI is thinking...
                  </div>
                )}
                {aiExplanation && (
                  <div style={{ 
                    color: '#fbbf24', 
                    fontSize: '14px', 
                    marginTop: '8px', 
                    fontStyle: 'italic' 
                  }}>
                    💭 {aiExplanation}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Player Hands */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: numPlayers === 1 
              ? 'repeat(1, 1fr)' 
              : numPlayers === 2 
                ? 'repeat(2, 1fr)' 
                : 'repeat(3, 1fr)', 
            gap: '32px', 
            marginTop: '48px' 
          }}>
            {players.slice(0, numPlayers).map((player, idx) => (
              <PlayerHand
                key={idx}
                player={player}
                isActive={currentPlayer === idx}
                gameState={gameState}
              />
            ))}
          </div>
          
          {/* Side Bets */}
          <SideBets
            gameState={gameState}
            currentPlayer={currentPlayer}
            pairBet={pairBet}
            hot3Bet={hot3Bet}
            pairBetOutcome={pairBetOutcome}
            hot3BetOutcome={hot3BetOutcome}
            onPlacePairBet={placePairBet}
            onPlaceHot3Bet={placeHot3Bet}
            playerChips={players[0].chips}
          />
          
          {/* Best Move Button - Only show for human player during their turn */}
          {gameState === 'playing' && currentPlayer === 0 && !aiThinking && (
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <button 
                onClick={getBestMove} 
                style={{ 
                  padding: '12px 32px', 
                  borderRadius: '12px', 
                  fontWeight: 'bold', 
                  fontSize: '18px', 
                  color: 'white', 
                  background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', 
                  border: '2px solid #fbbf24', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' 
                }}
              >
                💡 Best Move
              </button>
              {bestMoveRecommendation && (
                <div style={{ 
                  marginTop: '16px', 
                  display: 'inline-block', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  border: '2px solid #f59e0b', 
                  borderRadius: '12px', 
                  padding: '16px 24px' 
                }}>
                  <div style={{ 
                    color: '#fbbf24', 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px' 
                  }}>
                    Recommended: {bestMoveRecommendation.action}
                  </div>
                  <div style={{ 
                    color: '#fcd34d', 
                    fontSize: '14px', 
                    fontStyle: 'italic' 
                  }}>
                    💭 {bestMoveRecommendation.reason}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ 
            marginTop: '48px', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            flexWrap: 'wrap' 
          }}>
            {gameState === 'betting' && !players[currentPlayer].isAI && (
              <>
                <button 
                  onClick={() => placeBet(10)} 
                  disabled={players[currentPlayer].chips < 10} 
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 10 ? 0.5 : 1 
                  }}
                >
                  Bet $10
                </button>
                <button 
                  onClick={() => placeBet(50)} 
                  disabled={players[currentPlayer].chips < 50} 
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 50 ? 0.5 : 1 
                  }}
                >
                  Bet $50
                </button>
                <button 
                  onClick={() => placeBet(100)} 
                  disabled={players[currentPlayer].chips < 100} 
                  style={{ 
                    padding: '12px 24px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 100 ? 0.5 : 1 
                  }}
                >
                  Bet $100
                </button>
              </>
            )}
            
            {gameState === 'playing' && !players[currentPlayer].isAI && !aiThinking && (
              <>
                <button 
                  onClick={() => hit()} 
                  style={{ 
                    padding: '16px 40px', 
                    borderRadius: '12px', 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  Hit
                </button>
                <button 
                  onClick={() => stand()} 
                  style={{ 
                    padding: '16px 40px', 
                    borderRadius: '12px', 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'white', 
                    background: '#16a34a', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  Stand
                </button>
                {canDoubleDown() && (
                  <button 
                    onClick={() => doubleDown()} 
                    style={{ 
                      padding: '16px 40px', 
                      borderRadius: '12px', 
                      fontWeight: 'bold', 
                      fontSize: '20px', 
                      color: 'white', 
                      background: '#2563eb', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    Double
                  </button>
                )}
              </>
            )}
            
            {gameState === 'gameOver' && (
              <button 
                onClick={onNewRound} 
                style={{ 
                  padding: '16px 40px', 
                  borderRadius: '12px', 
                  fontWeight: 'bold', 
                  fontSize: '20px', 
                  color: 'white', 
                  background: '#f59e0b', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                Next Round
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Counter */}
      <CardCounter groupedCounts={groupedCounts} />
      
      {/* Mistake Log Modal */}
      {showMistakeLog && (
        <MistakeLog 
          mistakes={mistakes} 
          onClose={() => setShowMistakeLog(false)} 
        />
      )}
    </div>
  );
};

export default GameBoard;