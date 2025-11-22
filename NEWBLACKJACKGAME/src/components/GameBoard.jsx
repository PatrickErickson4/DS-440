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
    
    // Check if AI already has 21 (blackjack or hit 21)
    if (player.score === 21) {
      // Check if it's a natural blackjack (2 cards)
      if (player.hand.length === 2) {
        setMessage(`${player.name} has Blackjack! 🎉`);
      } else {
        setMessage(`${player.name} has 21!`);
      }
      
      // Move to next player after a brief pause
      setTimeout(() => {
        if (playerIndex < numPlayers - 1) {
          const nextIdx = playerIndex + 1;
          setCurrentPlayer(nextIdx);
          
          // Check if next player has blackjack
          if (currentPlayers[nextIdx].score === 21 && currentPlayers[nextIdx].hand.length === 2) {
            setMessage(`${currentPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (currentPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(currentPlayers, nextIdx, currentDeck, currentDealtCards, currentDealerHand), 1500);
            }
          } else if (currentPlayers[nextIdx].score === 21) {
            setMessage(`${currentPlayers[nextIdx].name} has 21!`);
            if (currentPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(currentPlayers, nextIdx, currentDeck, currentDealtCards, currentDealerHand), 1500);
            }
          } else {
            setMessage(`${currentPlayers[nextIdx].name}'s turn`);
            if (currentPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(currentPlayers, nextIdx, currentDeck, currentDealtCards, currentDealerHand), 1000);
            }
          }
        } else {
          dealerTurn();
        }
      }, 1500);
      return;
    }
    
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
    
    // Check for blackjacks and determine first player to act
    let firstPlayerToAct = 0;
    
    // Find first player without blackjack
    for (let p = 0; p < numPlayers; p++) {
      if (newPlayers[p].score === 21) {
        // Natural blackjack!
        newPlayers[p].hasBlackjack = true;
      } else {
        if (firstPlayerToAct === p) {
          break; // Found first player to act
        }
        firstPlayerToAct = p;
      }
    }
    
    // If everyone has blackjack, go straight to dealer
    if (firstPlayerToAct >= numPlayers || newPlayers.every(p => p.score === 21)) {
      setMessage('Everyone has Blackjack! Dealer\'s turn.');
      setBestMoveRecommendation(null);
      setTimeout(() => dealerTurn(), 2000);
      return;
    }
    
    // Set message based on first player
    if (newPlayers[firstPlayerToAct].score === 21) {
      setMessage(`${newPlayers[firstPlayerToAct].name} has Blackjack!`);
    } else {
      setMessage(`${newPlayers[firstPlayerToAct].name}'s turn`);
    }
    
    setCurrentPlayer(firstPlayerToAct);
    setBestMoveRecommendation(null);
    
    // If first player to act is AI and doesn't have blackjack, start their turn
    if (newPlayers[firstPlayerToAct].isAI && newPlayers[firstPlayerToAct].score < 21) {
      setTimeout(() => {
        handleAITurn(newPlayers, firstPlayerToAct, newDeck, newDealtCards, [dealerDeal1.card, dealerDeal2.card]);
      }, 1500);
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

    // Check if player busted
    if (newPlayers[actualPlayerIndex].score > 21) {
      setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
      setAiThinking(false);
      setAiExplanation('');
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          
          // Check if next player has blackjack
          if (newPlayers[nextIdx].score === 21 && newPlayers[nextIdx].hand.length === 2) {
            setMessage(`${newPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1500);
            }
          } else {
            setMessage(`${newPlayers[nextIdx].name}'s turn`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
            }
          }
        } else {
          dealerTurn();
        }
      }, 1500);
    } 
    // Check if player got 21 - turn is over
    else if (newPlayers[actualPlayerIndex].score === 21) {
      // Check if it's a natural blackjack (only possible with 2 cards at start)
      const isBlackjack = newPlayers[actualPlayerIndex].hand.length === 2;
      setMessage(`${newPlayers[actualPlayerIndex].name} has ${isBlackjack ? 'Blackjack! 🎉' : '21!'}`);
      setAiThinking(false);
      setAiExplanation('');
      
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          
          // Check if next player has blackjack
          if (newPlayers[nextIdx].score === 21 && newPlayers[nextIdx].hand.length === 2) {
            setMessage(`${newPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1500);
            }
          } else {
            setMessage(`${newPlayers[nextIdx].name}'s turn`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
            }
          }
        } else {
          dealerTurn();
        }
      }, 1000);
    } 
    // Player has less than 21, AI should continue, human waits for input
    else if (newPlayers[actualPlayerIndex].isAI) {
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
    
    // Clear AI thinking state
    setAiThinking(false);
    setAiExplanation('');
    
    if (actualPlayerIndex < numPlayers - 1) {
      const nextIdx = actualPlayerIndex + 1;
      setCurrentPlayer(nextIdx);
      
      // Check if next player has blackjack
      if (players[nextIdx].score === 21 && players[nextIdx].hand.length === 2) {
        setMessage(`${players[nextIdx].name} has Blackjack! 🎉`);
        if (players[nextIdx].isAI) {
          setTimeout(() => {
            handleAITurn(players, nextIdx, deck, dealtCards, dealerHand);
          }, 1500);
        }
      } else {
        setMessage(`${players[nextIdx].name}'s turn`);
        if (players[nextIdx].isAI) {
          setTimeout(() => {
            handleAITurn(players, nextIdx, deck, dealtCards, dealerHand);
          }, 1000);
        }
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

    // Clear AI thinking state
    setAiThinking(false);
    setAiExplanation('');

    if (newPlayers[actualPlayerIndex].score > 21) {
      setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          
          // Check if next player has blackjack
          if (newPlayers[nextIdx].score === 21 && newPlayers[nextIdx].hand.length === 2) {
            setMessage(`${newPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1500);
            }
          } else {
            setMessage(`${newPlayers[nextIdx].name}'s turn`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
            }
          }
        } else {
          dealerTurn();
        }
      }, 1500);
    } else if (newPlayers[actualPlayerIndex].score === 21) {
      setMessage(`${newPlayers[actualPlayerIndex].name} has 21!`);
      setTimeout(() => {
        if (actualPlayerIndex < numPlayers - 1) {
          const nextIdx = actualPlayerIndex + 1;
          setCurrentPlayer(nextIdx);
          
          // Check if next player has blackjack
          if (newPlayers[nextIdx].score === 21 && newPlayers[nextIdx].hand.length === 2) {
            setMessage(`${newPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1500);
            }
          } else {
            setMessage(`${newPlayers[nextIdx].name}'s turn`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
            }
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
          
          // Check if next player has blackjack
          if (newPlayers[nextIdx].score === 21 && newPlayers[nextIdx].hand.length === 2) {
            setMessage(`${newPlayers[nextIdx].name} has Blackjack! 🎉`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1500);
            }
          } else {
            setMessage(`${newPlayers[nextIdx].name}'s turn`);
            if (newPlayers[nextIdx].isAI) {
              setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
            }
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
    setAiThinking(false);
    setAiExplanation('');
    setMessage('Dealer\'s turn');
    
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
      padding: 'clamp(8px, 2vw, 16px)', 
      background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)', 
      position: 'relative' 
    }}>
      <div style={{ width: '100%', maxWidth: '1400px' }}>
        {/* End Game Button */}
        <div style={{ position: 'absolute', top: 'clamp(10px, 2vw, 20px)', right: 'clamp(10px, 2vw, 20px)', zIndex: 10 }}>
          <button 
            onClick={onEndGame} 
            style={{ 
              padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 24px)', 
              borderRadius: 'clamp(6px, 1vw, 8px)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(12px, 2vw, 16px)', 
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
        <div style={{ position: 'absolute', top: 'clamp(10px, 2vw, 20px)', left: 'clamp(10px, 2vw, 20px)', zIndex: 10 }}>
          <button 
            onClick={() => setShowMistakeLog(!showMistakeLog)} 
            style={{ 
              padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 24px)', 
              borderRadius: 'clamp(6px, 1vw, 8px)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(12px, 2vw, 16px)', 
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
        <div style={{ textAlign: 'center', marginBottom: 'clamp(12px, 3vw, 24px)', marginTop: 'clamp(60px, 10vw, 0px)' }}>
          <h1 style={{ 
            fontSize: 'clamp(28px, 7vw, 60px)', 
            fontWeight: 'bold', 
            marginBottom: 'clamp(4px, 1vw, 8px)', 
            background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontFamily: 'serif' 
          }}>
            Blackjack Table
          </h1>
          <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', color: '#fcd34d' }}>
            Cards: {deck.length} | Dealt: {dealtCards.length}
          </div>
        </div>
        
        {/* Game Table */}
        <div style={{ 
          borderRadius: 'clamp(12px, 3vw, 24px)', 
          background: 'linear-gradient(180deg, #0a5c3a 0%, #064d2e 100%)', 
          border: 'clamp(4px, 1.5vw, 12px) solid #4a1c1c', 
          padding: 'clamp(16px, 4vw, 48px)' 
        }}>
          {/* Dealer Hand */}
          <DealerHand 
            dealerHand={dealerHand} 
            dealerScore={dealerScore} 
            gameState={gameState} 
          />
          
          {/* Message Display */}
          {message && (
            <div style={{ textAlign: 'center', margin: 'clamp(16px, 4vw, 32px) 0' }}>
              <div style={{ 
                display: 'inline-block', 
                background: 'rgba(0,0,0,0.6)', 
                padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', 
                borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                border: '2px solid #fbbf24',
                maxWidth: '90vw'
              }}>
                <div style={{ 
                  color: '#fcd34d', 
                  fontSize: 'clamp(14px, 2.5vw, 18px)', 
                  fontWeight: 'bold', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {message}
                </div>
                {aiThinking && (
                  <div style={{ 
                    color: '#22c55e', 
                    fontSize: 'clamp(12px, 2vw, 14px)', 
                    marginTop: 'clamp(4px, 1vw, 8px)', 
                    fontStyle: 'italic' 
                  }}>
                    🤔 AI is thinking...
                  </div>
                )}
                {aiExplanation && (
                  <div style={{ 
                    color: '#fbbf24', 
                    fontSize: 'clamp(12px, 2vw, 14px)', 
                    marginTop: 'clamp(4px, 1vw, 8px)', 
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
              ? '1fr' 
              : numPlayers === 2 
                ? 'repeat(auto-fit, minmax(250px, 1fr))' 
                : 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 'clamp(16px, 3vw, 32px)', 
            marginTop: 'clamp(24px, 5vw, 48px)' 
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
          {gameState === 'playing' && currentPlayer === 0 && !aiThinking && players[0].score < 21 && (
            <div style={{ textAlign: 'center', margin: 'clamp(16px, 3vw, 24px) 0' }}>
              <button 
                onClick={getBestMove} 
                style={{ 
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 32px)', 
                  borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(14px, 2.5vw, 18px)', 
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
                  marginTop: 'clamp(12px, 2vw, 16px)', 
                  display: 'inline-block', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  border: '2px solid #f59e0b', 
                  borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                  padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
                  maxWidth: '90vw'
                }}>
                  <div style={{ 
                    color: '#fbbf24', 
                    fontSize: 'clamp(14px, 2.5vw, 16px)', 
                    fontWeight: 'bold', 
                    marginBottom: 'clamp(4px, 1vw, 8px)' 
                  }}>
                    Recommended: {bestMoveRecommendation.action}
                  </div>
                  <div style={{ 
                    color: '#fcd34d', 
                    fontSize: 'clamp(12px, 2vw, 14px)', 
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
            marginTop: 'clamp(24px, 5vw, 48px)', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(8px, 2vw, 16px)', 
            flexWrap: 'wrap',
            padding: '0 10px'
          }}>
            {gameState === 'betting' && !players[currentPlayer].isAI && (
              <>
                <button 
                  onClick={() => placeBet(10)} 
                  disabled={players[currentPlayer].chips < 10} 
                  style={{ 
                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', 
                    borderRadius: 'clamp(6px, 1vw, 8px)', 
                    fontWeight: 'bold', 
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 10 ? 0.5 : 1,
                    flex: '1 1 auto',
                    minWidth: 'clamp(80px, 20vw, 120px)',
                    maxWidth: '150px'
                  }}
                >
                  Bet $10
                </button>
                <button 
                  onClick={() => placeBet(50)} 
                  disabled={players[currentPlayer].chips < 50} 
                  style={{ 
                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', 
                    borderRadius: 'clamp(6px, 1vw, 8px)', 
                    fontWeight: 'bold', 
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 50 ? 0.5 : 1,
                    flex: '1 1 auto',
                    minWidth: 'clamp(80px, 20vw, 120px)',
                    maxWidth: '150px'
                  }}
                >
                  Bet $50
                </button>
                <button 
                  onClick={() => placeBet(100)} 
                  disabled={players[currentPlayer].chips < 100} 
                  style={{ 
                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', 
                    borderRadius: 'clamp(6px, 1vw, 8px)', 
                    fontWeight: 'bold', 
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer', 
                    opacity: players[currentPlayer].chips < 100 ? 0.5 : 1,
                    flex: '1 1 auto',
                    minWidth: 'clamp(80px, 20vw, 120px)',
                    maxWidth: '150px'
                  }}
                >
                  Bet $100
                </button>
              </>
            )}
            
            {gameState === 'playing' && !players[currentPlayer].isAI && !aiThinking && players[currentPlayer].score < 21 && (
              <>
                <button 
                  onClick={() => hit()} 
                  style={{ 
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 40px)', 
                    borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                    fontWeight: 'bold', 
                    fontSize: 'clamp(16px, 3vw, 20px)', 
                    color: 'white', 
                    background: '#dc2626', 
                    border: 'none', 
                    cursor: 'pointer',
                    flex: '1 1 auto',
                    minWidth: 'clamp(100px, 25vw, 140px)',
                    maxWidth: '180px'
                  }}
                >
                  Hit
                </button>
                <button 
                  onClick={() => stand()} 
                  style={{ 
                    padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 40px)', 
                    borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                    fontWeight: 'bold', 
                    fontSize: 'clamp(16px, 3vw, 20px)', 
                    color: 'white', 
                    background: '#16a34a', 
                    border: 'none', 
                    cursor: 'pointer',
                    flex: '1 1 auto',
                    minWidth: 'clamp(100px, 25vw, 140px)',
                    maxWidth: '180px'
                  }}
                >
                  Stand
                </button>
                {canDoubleDown() && (
                  <button 
                    onClick={() => doubleDown()} 
                    style={{ 
                      padding: 'clamp(12px, 2.5vw, 16px) clamp(20px, 4vw, 40px)', 
                      borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                      fontWeight: 'bold', 
                      fontSize: 'clamp(16px, 3vw, 20px)', 
                      color: 'white', 
                      background: '#2563eb', 
                      border: 'none', 
                      cursor: 'pointer',
                      flex: '1 1 auto',
                      minWidth: 'clamp(100px, 25vw, 140px)',
                      maxWidth: '180px'
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
                  padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 40px)', 
                  borderRadius: 'clamp(8px, 1.5vw, 12px)', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(16px, 3vw, 20px)', 
                  color: 'white', 
                  background: '#f59e0b', 
                  border: 'none', 
                  cursor: 'pointer',
                  minWidth: 'clamp(140px, 30vw, 200px)'
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