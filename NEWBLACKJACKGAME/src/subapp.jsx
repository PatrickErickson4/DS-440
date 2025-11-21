
// GAME BEFORE REFACTORING -- THIS WAS ALL 1 FILE IN "App.jsx"



// /**
//  * ═══════════════════════════════════════════════════════════════════════════
//  * MULTIPLAYER BLACKJACK GAME
//  * ═══════════════════════════════════════════════════════════════════════════
//  * 
//  * A comprehensive blackjack game with AI opponents, side bets, and strategy tracking.
//  * 
//  * FEATURES:
//  * - 1-3 player support (Player 1 human, others AI)
//  * - AI play styles: Aggressive, Optimal, Safe, Random
//  * - Side bets: Pair (5:1, 20:1) and Hot 3 (up to 100:1)
//  * - 6-deck shoe with card counting display
//  * - Mistake tracking with optimal strategy recommendations
//  * - Fully responsive mobile design
//  * - Gemini AI integration for realistic opponents
//  * 
//  * STATE MANAGEMENT:
//  * - 38+ state variables tracking game, players, AI, bets, and mistakes
//  * - Immutable updates for all state changes
//  * - React hooks (useState, useEffect) for reactivity
//  * 
//  * GAME FLOW:
//  * 1. Mode Selection (1-3 players)
//  * 2. AI Style Selection (multiplayer only)
//  * 3. Betting Phase (main + side bets)
//  * 4. Initial Deal (2 cards each)
//  * 5. Player Turns (hit/stand/double)
//  * 6. Dealer Turn (must hit <17)
//  * 7. Determine Winners
//  * 8. Next Round
//  * 
//  * See README.md for detailed documentation.
//  * 
//  * @version 2.0
//  * ═══════════════════════════════════════════════════════════════════════════
//  */

// import React, { useState, useEffect } from 'react';

// const BlackjackGame = () => {
  
//   /* ═══════════════════════════════════════════════════════════════════════
//    * MOBILE VIEWPORT SETUP
//    * ═══════════════════════════════════════════════════════════════════════
//    * Ensures proper mobile rendering with viewport meta tag
//    */
//   useEffect(() => {
//     const metaViewport = document.querySelector('meta[name="viewport"]');
//     if (!metaViewport) {
//       const meta = document.createElement('meta');
//       meta.name = 'viewport';
//       meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
//       document.head.appendChild(meta);
//     }
//   }, []);

//   /* ═══════════════════════════════════════════════════════════════════════
//    * STATE MANAGEMENT
//    * ═══════════════════════════════════════════════════════════════════════
//    * All game state variables with clear purposes
//    */
  
//   // --- GAME STATE ---
//   const [gameState, setGameState] = useState('modeSelect'); // Current game phase
//   const [message, setMessage] = useState('Select number of players'); // Display message
//   const [numPlayers, setNumPlayers] = useState(null); // 1, 2, or 3 players
//   const [currentPlayer, setCurrentPlayer] = useState(0); // Active player index
  
//   // --- DECK & CARDS ---
//   const [deck, setDeck] = useState([]); // Remaining cards in shoe
//   const [dealtCards, setDealtCards] = useState([]); // Dealt cards for counting
  
//   // --- DEALER ---
//   const [dealerHand, setDealerHand] = useState([]); // Dealer's cards
//   const [dealerScore, setDealerScore] = useState(0); // Dealer's score
  
//   // --- PLAYERS ---
//   // Array of player objects with hand, score, chips, bet, name, isAI, aiStyle
//   const [players, setPlayers] = useState([
//     { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 1', isAI: false, aiStyle: null },
//     { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 2', isAI: true, aiStyle: null },
//     { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 3', isAI: true, aiStyle: null }
//   ]);
  
//   // --- AI STATE ---
//   const [aiThinking, setAiThinking] = useState(false); // Is AI deciding?
//   const [aiExplanation, setAiExplanation] = useState(''); // AI's reasoning
//   const [aiPlayerIndex, setAiPlayerIndex] = useState(null); // Current AI player
//   const [selectedAIStyles, setSelectedAIStyles] = useState({ player2: null, player3: null });
  
//   // --- STRATEGY & MISTAKES ---
//   const [mistakes, setMistakes] = useState([]); // Player mistakes log
//   const [showMistakeLog, setShowMistakeLog] = useState(false); // Modal visibility
//   const [bestMoveRecommendation, setBestMoveRecommendation] = useState(null); // Optimal move
  
//   // --- SIDE BETS ---
//   const [pairBet, setPairBet] = useState(0); // Pair bet amount
//   const [pairBetOutcome, setPairBetOutcome] = useState(null); // Pair result
//   const [hot3Bet, setHot3Bet] = useState(0); // Hot 3 bet amount
//   const [hot3BetOutcome, setHot3BetOutcome] = useState(null); // Hot 3 result

//   /* ═══════════════════════════════════════════════════════════════════════
//    * CONSTANTS
//    * ═══════════════════════════════════════════════════════════════════════
//    */
//   const suits = ['♥', '♦', '♣', '♠'];
//   const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
//   const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

//   /* ═══════════════════════════════════════════════════════════════════════
//    * UTILITY FUNCTIONS
//    * ═══════════════════════════════════════════════════════════════════════
//    */
  
//   /**
//    * Get color for card suit (red for hearts/diamonds, black for clubs/spades)
//    */
//   const getSuitColor = (suit) => {
//     return suit === '♥' || suit === '♦' ? '#dc2626' : '#000000';
//   };

//   const createDeck = () => {
//     const newDeck = [];
//     for (let deckNum = 0; deckNum < 6; deckNum++) {
//       for (let i = 0; i < suitNames.length; i++) {
//         for (let value of values) {
//           newDeck.push({ suit: suits[i], suitName: suitNames[i], value });
//         }
//       }
//     }
//     return shuffleDeck(newDeck);
//   };

//   const shuffleDeck = (deck) => {
//     const shuffled = [...deck];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   const calculateScore = (hand) => {
//     let score = 0;
//     let aces = 0;
//     for (let card of hand) {
//       if (card.value === 'A') {
//         aces += 1;
//         score += 11;
//       } else if (['K', 'Q', 'J'].includes(card.value)) {
//         score += 10;
//       } else {
//         score += parseInt(card.value);
//       }
//     }
//     while (score > 21 && aces > 0) {
//       score -= 10;
//       aces -= 1;
//     }
//     return score;
//   };

//   const dealCard = (currentDeck, currentDealtCards) => {
//     const newDeck = [...currentDeck];
//     const card = newDeck.pop();
//     const newDealtCards = [...currentDealtCards, card];
//     return { card, newDeck, newDealtCards };
//   };

//   const getCardCount = () => {
//     const cardCounts = {};
//     for (let suit of suits) {
//       for (let value of values) {
//         const key = `${value}${suit}`;
//         cardCounts[key] = { dealt: 0, remaining: 6 };
//       }
//     }
//     for (let card of dealtCards) {
//       const key = `${card.value}${card.suit}`;
//       if (cardCounts[key]) {
//         cardCounts[key].dealt += 1;
//         cardCounts[key].remaining = 6 - cardCounts[key].dealt;
//       }
//     }
//     return cardCounts;
//   };

//   const getAIDecision = async (hand, dealerUpCard, chips, bet, playStyle, playerName) => {
//     const score = calculateScore(hand);
//     const dealerValue = dealerUpCard.value === 'A' ? 11 : ['K', 'Q', 'J'].includes(dealerUpCard.value) ? 10 : parseInt(dealerUpCard.value);
//     const canDouble = hand.length === 2 && chips >= bet;
//     const hasAce = hand.some(c => c.value === 'A');
//     const isSoft = hasAce && score <= 21;
    
//     // If random, pick a random style for this decision
//     let decisionStyle = playStyle;
//     if (playStyle === 'random') {
//       decisionStyle = getRandomStyle();
//     }
    
//     const aggressivePrompt = `You are an aggressive blackjack player. Always hit if total is 16 or less. Hit on soft 17. Double frequently. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;
//     const safePrompt = `You are a safe blackjack player. Stand on 15+. Stand on 12+ vs strong dealer. Only double 10-11 vs weak dealer. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;
//     const optimalPrompt = `You are playing optimal blackjack basic strategy. Hard hands: stand 17+, hit 16 vs 7-A, hit 12-16 vs 4-6 only. Soft hands: stand 19+, stand 18 vs 6 or less, hit 17 or less vs 7-A. Double 11 vs all except A, 10 vs 2-9, 9 vs 3-6. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;

//     try {
//       const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//       let selectedPrompt = safePrompt;
//       let temperature = 0.3;
      
//       if (decisionStyle === 'aggressive') {
//         selectedPrompt = aggressivePrompt;
//         temperature = 0.9;
//       } else if (decisionStyle === 'optimal') {
//         selectedPrompt = optimalPrompt;
//         temperature = 0.1;
//       }
      
//       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: selectedPrompt }] }],
//           generationConfig: { temperature: temperature, maxOutputTokens: 100 }
//         })
//       });
//       const data = await response.json();
//       const responseText = data.candidates[0].content.parts[0].text;
//       const actionMatch = responseText.match(/ACTION:\s*(HIT|STAND|DOUBLE)/i);
//       const reasonMatch = responseText.match(/REASON:\s*(.+)/i);
//       return { action: actionMatch ? actionMatch[1].toUpperCase() : 'STAND', reason: reasonMatch ? reasonMatch[1].trim() : 'Following strategy' };
//     } catch (error) {
//       console.error('AI Error:', error);
//       return getRuleBasedDecision(hand, dealerUpCard, chips, bet, decisionStyle);
//     }
//   };

//   const getRuleBasedDecision = (hand, dealerUpCard, chips, bet, playStyle) => {
//     const score = calculateScore(hand);
//     const dealerValue = dealerUpCard.value === 'A' ? 11 : ['K', 'Q', 'J'].includes(dealerUpCard.value) ? 10 : parseInt(dealerUpCard.value);
//     const canDouble = hand.length === 2 && chips >= bet;
//     const hasAce = hand.some(c => c.value === 'A');
//     const isSoft = hasAce && score <= 21;

//     if (playStyle === 'aggressive') {
//       if (canDouble && (score === 10 || score === 11)) return { action: 'DOUBLE', reason: 'Double down!' };
//       if (isSoft && score === 17) return { action: 'HIT', reason: 'Soft 17, hitting' };
//       if (score <= 16) return { action: 'HIT', reason: 'Fortune favors bold!' };
//       return { action: 'STAND', reason: 'Got strong hand' };
//     } else if (playStyle === 'optimal') {
//       // Optimal Basic Strategy
//       // Hard Totals
//       if (!isSoft) {
//         if (score >= 17) return { action: 'STAND', reason: 'Hard 17 or higher' };
//         if (score === 16) {
//           if (dealerValue >= 7) return { action: 'HIT', reason: 'Hard 16 vs strong dealer' };
//           return { action: 'STAND', reason: 'Hard 16 vs weak dealer' };
//         }
//         if (score === 15) {
//           if (dealerValue >= 7) return { action: 'HIT', reason: 'Hard 15 vs strong dealer' };
//           return { action: 'STAND', reason: 'Hard 15 vs weak dealer' };
//         }
//         if (score === 14 || score === 13 || score === 12) {
//           if (dealerValue >= 4 && dealerValue <= 6) return { action: 'STAND', reason: 'Stand vs weak dealer' };
//           return { action: 'HIT', reason: 'Hit vs strong dealer' };
//         }
//         if (score <= 11) return { action: 'HIT', reason: 'Cannot bust' };
//       }
//       // Soft Totals
//       else {
//         if (score >= 19) return { action: 'STAND', reason: 'Soft 19 or higher' };
//         if (score === 18) {
//           if (dealerValue >= 7) return { action: 'HIT', reason: 'Soft 18 vs strong dealer' };
//           return { action: 'STAND', reason: 'Soft 18 vs weak dealer' };
//         }
//         if (score === 17 || score === 16 || score === 15) {
//           if (dealerValue >= 4 && dealerValue <= 6 && canDouble) return { action: 'DOUBLE', reason: 'Double soft hand vs weak dealer' };
//           return { action: 'HIT', reason: 'Hit soft hand' };
//         }
//         if (score <= 14) return { action: 'HIT', reason: 'Hit low soft hand' };
//       }
//       // Double Down Opportunities
//       if (canDouble && hand.length === 2) {
//         if (score === 11) {
//           if (dealerValue !== 11) return { action: 'DOUBLE', reason: 'Double 11 vs all except A' };
//         }
//         if (score === 10 && dealerValue >= 2 && dealerValue <= 9) return { action: 'DOUBLE', reason: 'Double 10 vs weak dealer' };
//         if (score === 9 && dealerValue >= 3 && dealerValue <= 6) return { action: 'DOUBLE', reason: 'Double 9 vs weak dealer' };
//       }
//       return { action: 'STAND', reason: 'Following basic strategy' };
//     } else {
//       // Safe play style
//       if (score >= 15) return { action: 'STAND', reason: 'Playing safe on 15+' };
//       if (score >= 12) return { action: 'STAND', reason: 'Better safe than bust' };
//       if (canDouble && score === 11 && dealerValue >= 4 && dealerValue <= 6) return { action: 'DOUBLE', reason: 'Safe double' };
//       if (score <= 11) return { action: 'HIT', reason: 'Cannot bust' };
//       return { action: 'STAND', reason: 'Preserving total' };
//     }
//   };

//   const handleAITurn = async (currentPlayers, playerIndex, currentDeck, currentDealtCards, currentDealerHand) => {
//     const player = currentPlayers[playerIndex];
//     setAiThinking(true);
//     setCurrentPlayer(playerIndex); // Set it here too
//     setMessage(`${player.name} is thinking...`);
    
//     const decision = await getAIDecision(
//       player.hand,
//       currentDealerHand[0],
//       player.chips,
//       player.bet,
//       player.aiStyle,
//       player.name
//     );
    
//     setAiExplanation(`${player.name}: ${decision.reason}`);
    
//     setTimeout(() => {
//       setAiThinking(false);
//       setAiExplanation('');
      
//       // Pass the playerIndex directly to the action functions
//       if (decision.action === 'HIT') {
//         hit(playerIndex);
//       } else if (decision.action === 'DOUBLE') {
//         doubleDown(playerIndex);
//       } else {
//         stand(playerIndex);
//       }
//     }, 2000);
//   };

//   const selectMode = (num) => {
//     setNumPlayers(num);
//     if (num === 1) {
//       setGameState('betting');
//       setMessage('Place your bet');
//     } else {
//       setGameState('aiSelect');
//       setMessage('Select AI play styles');
//     }
//     const newPlayers = [...players];
//     for (let i = 0; i < num; i++) {
//       newPlayers[i] = { 
//         hand: [], 
//         score: 0, 
//         chips: 10000, 
//         bet: 0, 
//         name: `Player ${i + 1}`,
//         isAI: i > 0,  // Only Player 1 (index 0) is human
//         aiStyle: null
//       };
//     }
//     setPlayers(newPlayers);
//     setCurrentPlayer(0);
//   };

//   const getRandomStyle = () => {
//     const styles = ['aggressive', 'optimal', 'safe'];
//     return styles[Math.floor(Math.random() * styles.length)];
//   };

//   const confirmAIStyles = () => {
//     const newPlayers = [...players];
//     if (numPlayers >= 2) {
//       newPlayers[1].aiStyle = selectedAIStyles.player2;
//     }
//     if (numPlayers >= 3) {
//       newPlayers[2].aiStyle = selectedAIStyles.player3;
//     }
//     setPlayers(newPlayers);
//     setGameState('betting');
//     setMessage('Place your bets');
//   };

//   const placePairBet = (amount) => {
//     const player = players[0];
    
//     if (amount > player.chips) {
//       setMessage('Not enough chips for Pair bet!');
//       return;
//     }

//     const newPlayers = [...players];
//     newPlayers[0].chips -= amount;
//     setPlayers(newPlayers);
//     setPairBet(amount);
//     setMessage(`Pair bet placed: $${amount}`);
//   };

//   const placeHot3Bet = (amount) => {
//     const player = players[0];
    
//     if (amount > player.chips) {
//       setMessage('Not enough chips for Hot 3 bet!');
//       return;
//     }

//     const newPlayers = [...players];
//     newPlayers[0].chips -= amount;
//     setPlayers(newPlayers);
//     setHot3Bet(amount);
//     setMessage(`Hot 3 bet placed: $${amount}`);
//   };

//   const evaluatePairBet = (hand) => {
//     if (pairBet === 0 || hand.length < 2) return;

//     const card1 = hand[0];
//     const card2 = hand[1];

//     // Check if same rank
//     if (card1.value === card2.value) {
//       // Check if suited
//       if (card1.suit === card2.suit) {
//         // Suited pair - 20:1
//         const winAmount = pairBet * 20;
//         const newPlayers = [...players];
//         newPlayers[0].chips += pairBet + winAmount;
//         setPlayers(newPlayers);
//         setPairBetOutcome({ won: true, payout: winAmount, type: 'Suited Pair' });
//       } else {
//         // Same rank, different suit - 5:1
//         const winAmount = pairBet * 5;
//         const newPlayers = [...players];
//         newPlayers[0].chips += pairBet + winAmount;
//         setPlayers(newPlayers);
//         setPairBetOutcome({ won: true, payout: winAmount, type: 'Pair' });
//       }
//     } else {
//       // Lost
//       setPairBetOutcome({ won: false, payout: 0, type: 'No Pair' });
//     }
//   };

//   const evaluateHot3Bet = (playerHand, dealerUpCard) => {
//     if (hot3Bet === 0 || playerHand.length < 2 || !dealerUpCard) return;

//     // Combine player's two cards and dealer's up card
//     const threeCards = [...playerHand.slice(0, 2), dealerUpCard];
    
//     // Calculate total using blackjack scoring
//     let total = 0;
//     let aces = 0;
    
//     for (let card of threeCards) {
//       if (card.value === 'A') {
//         aces += 1;
//         total += 11;
//       } else if (['K', 'Q', 'J'].includes(card.value)) {
//         total += 10;
//       } else {
//         total += parseInt(card.value);
//       }
//     }
    
//     // Adjust for aces if needed
//     while (total > 21 && aces > 0) {
//       total -= 10;
//       aces -= 1;
//     }
    
//     // Check for three 7s
//     const allSevens = threeCards.every(card => card.value === '7');
    
//     // Check for suited 21 (all same suit)
//     const allSameSuit = threeCards.every(card => card.suit === threeCards[0].suit);
//     const suited21 = total === 21 && allSameSuit;
    
//     const newPlayers = [...players];
    
//     if (allSevens) {
//       // Three 7s - 100:1
//       const winAmount = hot3Bet * 100;
//       newPlayers[0].chips += hot3Bet + winAmount;
//       setPlayers(newPlayers);
//       setHot3BetOutcome({ won: true, payout: winAmount, type: 'Three 7s! 🎰', total });
//     } else if (suited21) {
//       // Suited 21 - 20:1
//       const winAmount = hot3Bet * 20;
//       newPlayers[0].chips += hot3Bet + winAmount;
//       setPlayers(newPlayers);
//       setHot3BetOutcome({ won: true, payout: winAmount, type: 'Suited 21! ♠️', total });
//     } else if (total === 21) {
//       // Any 21 - 4:1
//       const winAmount = hot3Bet * 4;
//       newPlayers[0].chips += hot3Bet + winAmount;
//       setPlayers(newPlayers);
//       setHot3BetOutcome({ won: true, payout: winAmount, type: 'Twenty-One!', total });
//     } else if (total === 20) {
//       // 20 - 2:1
//       const winAmount = hot3Bet * 2;
//       newPlayers[0].chips += hot3Bet + winAmount;
//       setPlayers(newPlayers);
//       setHot3BetOutcome({ won: true, payout: winAmount, type: 'Twenty', total });
//     } else if (total === 19) {
//       // 19 - 1:1
//       const winAmount = hot3Bet * 1;
//       newPlayers[0].chips += hot3Bet + winAmount;
//       setPlayers(newPlayers);
//       setHot3BetOutcome({ won: true, payout: winAmount, type: 'Nineteen', total });
//     } else {
//       // Lost
//       setHot3BetOutcome({ won: false, payout: 0, type: 'No Win', total });
//     }
//   };

//   const placeBet = (amount) => {
//     const player = players[currentPlayer];
    
//     // Validate bet amount for human players
//     if (!player.isAI && amount > player.chips) {
//       setMessage('Not enough chips!');
//       return;
//     }

//     const newPlayers = [...players];
//     newPlayers[currentPlayer].chips -= amount;
//     newPlayers[currentPlayer].bet = amount;
//     setPlayers(newPlayers);

//     // Check if there are more players to bet
//     if (currentPlayer < numPlayers - 1) {
//       const nextPlayerIndex = currentPlayer + 1;
      
//       // Move to next player
//       setTimeout(() => {
//         setCurrentPlayer(nextPlayerIndex);
//         setMessage(`${newPlayers[nextPlayerIndex].name}, place your bet`);
        
//         // If next player is AI, have them place bet automatically
//         if (newPlayers[nextPlayerIndex].isAI) {
//           setTimeout(() => {
//             let aiBet;
//             if (newPlayers[nextPlayerIndex].aiStyle === 'aggressive') {
//               aiBet = 100;
//             } else if (newPlayers[nextPlayerIndex].aiStyle === 'optimal') {
//               aiBet = 75; // Balanced bet for optimal play
//             } else if (newPlayers[nextPlayerIndex].aiStyle === 'random') {
//               aiBet = 75; // Random players use balanced bet
//             } else {
//               aiBet = 50; // Safe play
//             }
//             const finalBet = Math.min(aiBet, newPlayers[nextPlayerIndex].chips);
            
//             // Directly update and move on (avoid recursive call)
//             const updatedPlayers = [...newPlayers];
//             updatedPlayers[nextPlayerIndex].chips -= finalBet;
//             updatedPlayers[nextPlayerIndex].bet = finalBet;
//             setPlayers(updatedPlayers);
            
//             // Check if this was the last player
//             if (nextPlayerIndex < numPlayers - 1) {
//               // More players to go
//               const nextNext = nextPlayerIndex + 1;
//               setTimeout(() => {
//                 setCurrentPlayer(nextNext);
//                 setMessage(`${updatedPlayers[nextNext].name}, place your bet`);
                
//                 // If that player is also AI
//                 if (updatedPlayers[nextNext].isAI) {
//                   setTimeout(() => {
//                     let aiBet2;
//                     if (updatedPlayers[nextNext].aiStyle === 'aggressive') {
//                       aiBet2 = 100;
//                     } else if (updatedPlayers[nextNext].aiStyle === 'optimal') {
//                       aiBet2 = 75;
//                     } else if (updatedPlayers[nextNext].aiStyle === 'random') {
//                       aiBet2 = 75;
//                     } else {
//                       aiBet2 = 50;
//                     }
//                     const finalBet2 = Math.min(aiBet2, updatedPlayers[nextNext].chips);
                    
//                     updatedPlayers[nextNext].chips -= finalBet2;
//                     updatedPlayers[nextNext].bet = finalBet2;
//                     setPlayers([...updatedPlayers]);
                    
//                     // Now start the game
//                     setTimeout(() => startGame(), 500);
//                   }, 1000);
//                 }
//               }, 500);
//             } else {
//               // This was the last player, start game
//               setTimeout(() => startGame(), 500);
//             }
//           }, 1000);
//         }
//       }, 100);
//     } else {
//       // This was the last player, start game
//       setTimeout(() => startGame(), 500);
//     }
//   };

//   const startGame = () => {
//     let newDeck = [...deck];
//     let newDealtCards = [...dealtCards];
    
//     if (newDeck.length < 15) {
//       newDeck = createDeck();
//       newDealtCards = [];
//     }

//     const newPlayers = [...players];
    
//     for (let p = 0; p < numPlayers; p++) {
//       const deal1 = dealCard(newDeck, newDealtCards);
//       newDeck = deal1.newDeck;
//       newDealtCards = deal1.newDealtCards;
//       newPlayers[p].hand = [deal1.card];
//     }

//     const dealerDeal1 = dealCard(newDeck, newDealtCards);
//     newDeck = dealerDeal1.newDeck;
//     newDealtCards = dealerDeal1.newDealtCards;
//     setDealerHand([dealerDeal1.card]);

//     for (let p = 0; p < numPlayers; p++) {
//       const deal2 = dealCard(newDeck, newDealtCards);
//       newDeck = deal2.newDeck;
//       newDealtCards = deal2.newDealtCards;
//       newPlayers[p].hand.push(deal2.card);
//     }

//     const dealerDeal2 = dealCard(newDeck, newDealtCards);
//     newDeck = dealerDeal2.newDeck;
//     newDealtCards = dealerDeal2.newDealtCards;
//     setDealerHand([dealerDeal1.card, dealerDeal2.card]);

//     for (let p = 0; p < numPlayers; p++) {
//       newPlayers[p].score = calculateScore(newPlayers[p].hand);
//     }

//     setDeck(newDeck);
//     setDealtCards(newDealtCards);
//     setPlayers(newPlayers);
//     setDealerScore(calculateScore([dealerDeal1.card, dealerDeal2.card]));
//     setCurrentPlayer(0);
//     setGameState('playing');
//     setMessage(`${newPlayers[0].name}'s turn`);
//     setBestMoveRecommendation(null);  // Reset best move for new hand
    
//     // Evaluate Pair bet for Player 1 after initial deal
//     evaluatePairBet(newPlayers[0].hand);
    
//     // Evaluate Hot 3 bet for Player 1 after initial deal
//     evaluateHot3Bet(newPlayers[0].hand, dealerDeal1.card);
    
//     // Remove this - Player 1 is always human!
//     // Don't call handleAITurn here
//   };

//   const checkForMistake = (hand, dealerUpCard, action, chips, bet) => {
//     const optimalDecision = getRuleBasedDecision(hand, dealerUpCard, chips, bet, 'optimal');
//     if (optimalDecision.action !== action) {
//       const score = calculateScore(hand);
//       const hasAce = hand.some(c => c.value === 'A');
//       const isSoft = hasAce && score <= 21;
      
//       const mistake = {
//         hand: `${hand.map(c => c.value + c.suit).join(', ')}`,
//         score: score,
//         soft: isSoft,
//         dealerCard: `${dealerUpCard.value}${dealerUpCard.suit}`,
//         playerAction: action,
//         optimalAction: optimalDecision.action,
//         reason: optimalDecision.reason,
//         timestamp: new Date().toLocaleTimeString()
//       };
      
//       setMistakes(prev => [...prev, mistake]);
//       return true;
//     }
//     return false;
//   };

//   const getBestMove = () => {
//     if (players[0].hand.length === 0) return;
    
//     const optimalDecision = getRuleBasedDecision(
//       players[0].hand,
//       dealerHand[0],
//       players[0].chips,
//       players[0].bet,
//       'optimal'
//     );
    
//     setBestMoveRecommendation(optimalDecision);
//   };
//   const hit = (playerIndex = null) => {
//     const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
//     console.log('HIT called for player index:', actualPlayerIndex);
//     console.log('Current player:', currentPlayer);
//     console.log('Players array:', players);
    
//     // Check for mistake if Player 1 (human) is hitting
//     if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
//       checkForMistake(players[actualPlayerIndex].hand, dealerHand[0], 'HIT', players[actualPlayerIndex].chips, players[actualPlayerIndex].bet);
//     }
    
//     const result = dealCard(deck, dealtCards);
//     const newPlayers = [...players];
//     newPlayers[actualPlayerIndex].hand.push(result.card);
//     newPlayers[actualPlayerIndex].score = calculateScore(newPlayers[actualPlayerIndex].hand);

//     console.log('New score:', newPlayers[actualPlayerIndex].score);

//     setDeck(result.newDeck);
//     setDealtCards(result.newDealtCards);
//     setPlayers(newPlayers);
//     setCurrentPlayer(actualPlayerIndex);

//     if (newPlayers[actualPlayerIndex].score > 21) {
//       console.log('BUST!');
//       setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
//       setTimeout(() => {
//         if (actualPlayerIndex < numPlayers - 1) {
//           const nextIdx = actualPlayerIndex + 1;
//           setCurrentPlayer(nextIdx);
//           setMessage(`${newPlayers[nextIdx].name}'s turn`);
//           if (newPlayers[nextIdx].isAI) {
//             setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
//           }
//         } else {
//           dealerTurn();
//         }
//       }, 1500);
//     } else if (newPlayers[actualPlayerIndex].score === 21) {
//       console.log('Got 21!');
//       setTimeout(() => {
//         if (actualPlayerIndex < numPlayers - 1) {
//           const nextIdx = actualPlayerIndex + 1;
//           setCurrentPlayer(nextIdx);
//           setMessage(`${newPlayers[nextIdx].name}'s turn`);
//           if (newPlayers[nextIdx].isAI) {
//             setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
//           }
//         } else {
//           dealerTurn();
//         }
//       }, 1000);
//     } else if (newPlayers[actualPlayerIndex].isAI) {
//       console.log('AI continues...');
//       setTimeout(() => {
//         handleAITurn(newPlayers, actualPlayerIndex, result.newDeck, result.newDealtCards, dealerHand);
//       }, 500);
//     } else {
//       console.log('Human player continues - should see new card');
//     }
//   };

//   const stand = (playerIndex = null) => {
//     const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
    
//     // Check for mistake if Player 1 (human) is standing
//     if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
//       checkForMistake(players[actualPlayerIndex].hand, dealerHand[0], 'STAND', players[actualPlayerIndex].chips, players[actualPlayerIndex].bet);
//     }
    
//     if (actualPlayerIndex < numPlayers - 1) {
//       const nextIdx = actualPlayerIndex + 1;
//       setCurrentPlayer(nextIdx);
//       setMessage(`${players[nextIdx].name}'s turn`);
      
//       if (players[nextIdx].isAI) {
//         setTimeout(() => {
//           handleAITurn(players, nextIdx, deck, dealtCards, dealerHand);
//         }, 1000);
//       }
//     } else {
//       dealerTurn();
//     }
//   };

//   const nextPlayer = () => {
//     if (currentPlayer < numPlayers - 1) {
//       const nextIdx = currentPlayer + 1;
      
//       // Update current player state first
//       setCurrentPlayer(nextIdx);
//       setMessage(`${players[nextIdx].name}'s turn`);
      
//       if (players[nextIdx].isAI) {
//         // Use setTimeout to ensure state has updated
//         setTimeout(() => {
//           // Get fresh state by using the players array directly
//           const freshPlayers = [...players];
//           freshPlayers.forEach((p, i) => {
//             if (i === nextIdx) {
//               console.log(`AI Turn for ${p.name}, Score: ${p.score}`);
//             }
//           });
          
//           handleAITurn(freshPlayers, nextIdx, deck, dealtCards, dealerHand);
//         }, 1000);
//       }
//     } else {
//       dealerTurn();
//     }
//   };

//   const dealerTurn = () => {
//     setGameState('dealerTurn');
//     let newDealerHand = [...dealerHand];
//     let newDeck = [...deck];
//     let newDealtCards = [...dealtCards];
//     let dScore = calculateScore(newDealerHand);
//     setTimeout(() => {
//       while (dScore < 17) {
//         const result = dealCard(newDeck, newDealtCards);
//         newDealerHand.push(result.card);
//         newDeck = result.newDeck;
//         newDealtCards = result.newDealtCards;
//         dScore = calculateScore(newDealerHand);
//       }
//       setDealerHand(newDealerHand);
//       setDealerScore(dScore);
//       setDeck(newDeck);
//       setDealtCards(newDealtCards);
//       determineWinners(dScore);
//     }, 1000);
//   };

//   const determineWinners = (dScore) => {
//     setGameState('gameOver');
//     const newPlayers = [...players];
//     let resultMsg = `Dealer: ${dScore}\n\n`;
//     for (let p = 0; p < numPlayers; p++) {
//       const pScore = newPlayers[p].score;
//       const bet = newPlayers[p].bet;
//       if (pScore > 21) {
//         resultMsg += `${newPlayers[p].name}: BUST\n`;
//       } else if (dScore > 21) {
//         const winAmount = bet * 2;
//         newPlayers[p].chips += bet + winAmount;
//         resultMsg += `${newPlayers[p].name}: +$${winAmount}\n`;
//       } else if (pScore > dScore) {
//         const winAmount = bet * 2;
//         newPlayers[p].chips += bet + winAmount;
//         resultMsg += `${newPlayers[p].name}: +$${winAmount}\n`;
//       } else if (pScore < dScore) {
//         resultMsg += `${newPlayers[p].name}: Lost $${bet}\n`;
//       } else {
//         newPlayers[p].chips += bet;
//         resultMsg += `${newPlayers[p].name}: Push\n`;
//       }
//     }
//     setPlayers(newPlayers);
//     setMessage(resultMsg);
//   };

//   const doubleDown = (playerIndex = null) => {
//     const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
//     const player = players[actualPlayerIndex];
    
//     // Check for mistake if Player 1 (human) is doubling down
//     if (actualPlayerIndex === 0 && players[actualPlayerIndex].hand.length > 0) {
//       checkForMistake(players[actualPlayerIndex].hand, dealerHand[0], 'DOUBLE', players[actualPlayerIndex].chips, players[actualPlayerIndex].bet);
//     }
    
//     if (player.chips < player.bet) {
//       setMessage('Not enough chips to double down!');
//       return;
//     }

//     const result = dealCard(deck, dealtCards);
//     const newPlayers = [...players];
//     newPlayers[actualPlayerIndex].chips -= newPlayers[actualPlayerIndex].bet;
//     newPlayers[actualPlayerIndex].bet *= 2;
//     newPlayers[actualPlayerIndex].hand.push(result.card);
//     newPlayers[actualPlayerIndex].score = calculateScore(newPlayers[actualPlayerIndex].hand);

//     setDeck(result.newDeck);
//     setDealtCards(result.newDealtCards);
//     setPlayers(newPlayers);
//     setCurrentPlayer(actualPlayerIndex);

//     if (newPlayers[actualPlayerIndex].score > 21) {
//       setMessage(`${newPlayers[actualPlayerIndex].name} BUSTS!`);
//       setTimeout(() => {
//         if (actualPlayerIndex < numPlayers - 1) {
//           const nextIdx = actualPlayerIndex + 1;
//           setCurrentPlayer(nextIdx);
//           setMessage(`${newPlayers[nextIdx].name}'s turn`);
//           if (newPlayers[nextIdx].isAI) {
//             setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
//           }
//         } else {
//           dealerTurn();
//         }
//       }, 1500);
//     } else {
//       setTimeout(() => {
//         if (actualPlayerIndex < numPlayers - 1) {
//           const nextIdx = actualPlayerIndex + 1;
//           setCurrentPlayer(nextIdx);
//           setMessage(`${newPlayers[nextIdx].name}'s turn`);
//           if (newPlayers[nextIdx].isAI) {
//             setTimeout(() => handleAITurn(newPlayers, nextIdx, result.newDeck, result.newDealtCards, dealerHand), 1000);
//           }
//         } else {
//           dealerTurn();
//         }
//       }, 500);
//     }
//   };

//   const newRound = () => {
//     setDealerHand([]);
//     setGameState('betting');
//     setMessage('Place your bets');
//     setCurrentPlayer(0);
//     setDealerScore(0);
//     setBestMoveRecommendation(null);  // Reset best move for new round
//     setPairBet(0);  // Reset Pair bet
//     setPairBetOutcome(null);  // Reset Pair bet outcome
//     setHot3Bet(0);  // Reset Hot 3 bet
//     setHot3BetOutcome(null);  // Reset Hot 3 bet outcome
//     // Don't reset mistakes - keep them for the entire session
//     const newPlayers = [...players];
//     for (let i = 0; i < numPlayers; i++) {
//       newPlayers[i].hand = [];
//       newPlayers[i].score = 0;
//       newPlayers[i].bet = 0;
//     }
//     setPlayers(newPlayers);
//   };

//   const canDoubleDown = () => {
//     return players[currentPlayer].hand.length === 2 && players[currentPlayer].chips >= players[currentPlayer].bet;
//   };

//   const endGame = () => {
//     setNumPlayers(null);
//     setCurrentPlayer(0);
//     setDealerHand([]);
//     setDealerScore(0);
//     setDealtCards([]);
//     setGameState('modeSelect');
//     setMessage('Select number of players');
//     setDeck(createDeck());
//     setSelectedAIStyles({ player2: null, player3: null });
//     setMistakes([]);  // Reset mistakes when ending game
//     setShowMistakeLog(false);  // Close the modal
//     setPairBet(0);  // Reset Pair bet
//     setPairBetOutcome(null);  // Reset Pair bet outcome
//     setHot3Bet(0);  // Reset Hot 3 bet
//     setHot3BetOutcome(null);  // Reset Hot 3 bet outcome
//     const newPlayers = [
//       { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 1', isAI: false, aiStyle: null },
//       { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 2', isAI: true, aiStyle: null },
//       { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 3', isAI: true, aiStyle: null }
//     ];
//     setPlayers(newPlayers);
//   };

//   useEffect(() => {
//     setDeck(createDeck());
//   }, []);

//   // Responsive card dimensions
//   const getCardStyle = () => {
//     const isMobile = window.innerWidth <= 768;
//     return {
//       width: isMobile ? '60px' : '96px',
//       height: isMobile ? '90px' : '144px',
//       borderRadius: isMobile ? '6px' : '8px',
//       boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: isMobile ? '4px' : '8px'
//     };
//   };

//   const cardStyle = getCardStyle();

//   const Card = ({ card, hidden }) => {
//     const isMobile = window.innerWidth <= 768;
//     return (
//       <div style={{ ...cardStyle, background: hidden ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' : '#ffffff', border: '3px solid rgba(255,255,255,0.3)', color: hidden ? '#ffffff' : getSuitColor(card.suit) }}>
//         {hidden ? (
//           <div style={{ fontSize: isMobile ? '36px' : '60px', opacity: 0.3 }}>?</div>
//         ) : (
//           <>
//             <div style={{ fontSize: isMobile ? '14px' : '24px', fontWeight: 'bold' }}>{card.value}</div>
//             <div style={{ fontSize: isMobile ? '28px' : '48px' }}>{card.suit}</div>
//             <div style={{ fontSize: isMobile ? '14px' : '24px', fontWeight: 'bold', transform: 'rotate(180deg)' }}>{card.value}</div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const cardCounts = getCardCount();
//   const groupedCounts = {};
//   values.forEach(value => {
//     groupedCounts[value] = { dealt: 0, remaining: 0 };
//     suits.forEach(suit => {
//       const key = `${value}${suit}`;
//       groupedCounts[value].dealt += cardCounts[key].dealt;
//       groupedCounts[value].remaining += cardCounts[key].remaining;
//     });
//   });

//   if (gameState === 'modeSelect') {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)', padding: '16px' }}>
//         <div style={{ textAlign: 'center', maxWidth: '100%' }}>
//           <h1 style={{ fontSize: 'clamp(36px, 10vw, 72px)', fontWeight: 'bold', marginBottom: '40px', background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'serif' }}>Blackjack</h1>
//           <div style={{ fontSize: 'clamp(18px, 5vw, 32px)', color: '#fcd34d', marginBottom: '60px', fontWeight: 'bold' }}>Select Number of Players</div>
//           <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 40px)', justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px' }}>
//             <button onClick={() => selectMode(1)} style={{ padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', borderRadius: '16px', fontWeight: 'bold', fontSize: 'clamp(18px, 4vw, 28px)', color: 'white', background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', minWidth: '120px' }}>Solo</button>
//             <button onClick={() => selectMode(2)} style={{ padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', borderRadius: '16px', fontWeight: 'bold', fontSize: 'clamp(18px, 4vw, 28px)', color: 'white', background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)', border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', minWidth: '120px' }}>2 Players</button>
//             <button onClick={() => selectMode(3)} style={{ padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 48px)', borderRadius: '16px', fontWeight: 'bold', fontSize: 'clamp(18px, 4vw, 28px)', color: 'white', background: 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', minWidth: '120px' }}>3 Players</button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (gameState === 'aiSelect') {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)', padding: '16px' }}>
//         <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%', padding: 'clamp(16px, 4vw, 40px)' }}>
//           <h1 style={{ fontSize: 'clamp(32px, 8vw, 60px)', fontWeight: 'bold', marginBottom: '20px', background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'serif' }}>Configure AI Players</h1>
//           <div style={{ fontSize: 'clamp(14px, 3vw, 20px)', color: '#fcd34d', marginBottom: '40px' }}>You control Player 1. Select play styles for AI players:</div>          {numPlayers >= 2 && (
//             <div style={{ background: 'rgba(0,0,0,0.6)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '16px', marginBottom: '24px', border: '2px solid #fbbf24' }}>
//               <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: 'white', marginBottom: '16px', fontWeight: 'bold' }}>Player 2 (AI)</div>
//               <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player2: 'aggressive'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player2 === 'aggressive' ? 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' : 'rgba(220, 38, 38, 0.3)', border: selectedAIStyles.player2 === 'aggressive' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🔥 Aggressive</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player2: 'optimal'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player2 === 'optimal' ? 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)' : 'rgba(139, 92, 246, 0.3)', border: selectedAIStyles.player2 === 'optimal' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>⭐ Optimal</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player2: 'safe'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player2 === 'safe' ? 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)' : 'rgba(37, 99, 235, 0.3)', border: selectedAIStyles.player2 === 'safe' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🛡️ Safe</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player2: 'random'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player2 === 'random' ? 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)' : 'rgba(236, 72, 153, 0.3)', border: selectedAIStyles.player2 === 'random' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🎲 Random</button>
//               </div>
//             </div>
//           )}
//           {numPlayers >= 3 && (
//             <div style={{ background: 'rgba(0,0,0,0.6)', padding: 'clamp(16px, 3vw, 24px)', borderRadius: '16px', marginBottom: '24px', border: '2px solid #fbbf24' }}>
//               <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', color: 'white', marginBottom: '16px', fontWeight: 'bold' }}>Player 3 (AI)</div>
//               <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player3: 'aggressive'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player3 === 'aggressive' ? 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' : 'rgba(220, 38, 38, 0.3)', border: selectedAIStyles.player3 === 'aggressive' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🔥 Aggressive</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player3: 'optimal'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player3 === 'optimal' ? 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)' : 'rgba(139, 92, 246, 0.3)', border: selectedAIStyles.player3 === 'optimal' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>⭐ Optimal</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player3: 'safe'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player3 === 'safe' ? 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)' : 'rgba(37, 99, 235, 0.3)', border: selectedAIStyles.player3 === 'safe' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🛡️ Safe</button>
//                 <button onClick={() => setSelectedAIStyles({...selectedAIStyles, player3: 'random'})} style={{ padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 20px)', color: 'white', background: selectedAIStyles.player3 === 'random' ? 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)' : 'rgba(236, 72, 153, 0.3)', border: selectedAIStyles.player3 === 'random' ? '3px solid #ffd700' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>🎲 Random</button>
//               </div>
//             </div>
//           )}
//           <button onClick={confirmAIStyles} disabled={(numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)} style={{ padding: 'clamp(14px, 3vw, 20px) clamp(24px, 5vw, 48px)', borderRadius: '16px', fontWeight: 'bold', fontSize: 'clamp(16px, 3vw, 24px)', color: 'white', background: ((numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)) ? 'rgba(128,128,128,0.5)' : 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)', border: '3px solid rgba(255,255,255,0.3)', cursor: ((numPlayers >= 2 && !selectedAIStyles.player2) || (numPlayers >= 3 && !selectedAIStyles.player3)) ? 'not-allowed' : 'pointer', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', marginTop: '32px' }}>Start Game</button>
//           <button onClick={() => { setGameState('modeSelect'); setSelectedAIStyles({ player2: null, player3: null }); }} style={{ padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 2vw, 16px)', color: 'white', background: 'rgba(128,128,128,0.5)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer', marginTop: '16px', marginLeft: '16px' }}>Back</button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <>
//     <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(8px, 2vw, 16px)', background: 'linear-gradient(180deg, #4a0e0e 0%, #1a0505 100%)', position: 'relative' }}>
//       <div style={{ width: '100%', maxWidth: '1400px' }}>
//         <div style={{ position: 'absolute', top: 'clamp(10px, 2vw, 20px)', right: 'clamp(10px, 2vw, 20px)' }}>
//           <button onClick={endGame} style={{ padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 16px)', color: 'white', background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>End Game</button>
//         </div>
//         <div style={{ position: 'absolute', top: 'clamp(10px, 2vw, 20px)', left: 'clamp(10px, 2vw, 20px)' }}>
//           <button onClick={() => setShowMistakeLog(!showMistakeLog)} style={{ padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 16px)', color: 'white', background: mistakes.length > 0 ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)' : 'rgba(245, 158, 11, 0.3)', border: mistakes.length > 0 ? '2px solid #fbbf24' : '2px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>📋 Mistakes ({mistakes.length})</button>
//         </div>
//         <div style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
//           <h1 style={{ fontSize: 'clamp(32px, 7vw, 60px)', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(180deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'serif' }}>Blackjack Table</h1>
//           <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', color: '#fcd34d' }}>Cards: {deck.length} | Dealt: {dealtCards.length}</div>
//         </div>
//         <div style={{ borderRadius: 'clamp(16px, 3vw, 24px)', background: 'linear-gradient(180deg, #0a5c3a 0%, #064d2e 100%)', border: 'clamp(6px, 1.5vw, 12px) solid #4a1c1c', padding: 'clamp(24px, 5vw, 48px)' }}>
//           <div style={{ marginBottom: 'clamp(32px, 6vw, 64px)', textAlign: 'center' }}>
//             <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.4)', padding: 'clamp(6px, 1.5vw, 8px) clamp(16px, 3vw, 24px)', borderRadius: '9999px' }}>
//               <div style={{ color: 'white', fontSize: 'clamp(16px, 3vw, 24px)', fontWeight: 'bold' }}>Dealer</div>
//               <div style={{ color: '#fcd34d', fontSize: 'clamp(14px, 2.5vw, 20px)' }}>Value: {(gameState === 'playing' || gameState === 'betting') && dealerHand.length > 0 ? calculateScore([dealerHand[0]]) : dealerScore}</div>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 12px)', marginTop: '16px', flexWrap: 'wrap' }}>
//               {dealerHand.map((card, i) => (<Card key={i} card={card} hidden={i === 1 && (gameState === 'playing' || gameState === 'betting')} />))}
//             </div>
//           </div>
//           {message && (
//             <div style={{ textAlign: 'center', margin: 'clamp(16px, 3vw, 32px) 0' }}>
//               <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.6)', padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 32px)', borderRadius: '12px', border: '2px solid #fbbf24', maxWidth: '90%' }}>
//                 <div style={{ color: '#fcd34d', fontSize: 'clamp(14px, 2.5vw, 18px)', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{message}</div>
//                 {aiThinking && (<div style={{ color: '#22c55e', fontSize: 'clamp(12px, 2vw, 14px)', marginTop: '8px', fontStyle: 'italic' }}>🤔 AI is thinking...</div>)}
//                 {aiExplanation && (<div style={{ color: '#fbbf24', fontSize: 'clamp(12px, 2vw, 14px)', marginTop: '8px', fontStyle: 'italic' }}>💭 {aiExplanation}</div>)}
//               </div>
//             </div>
//           )}
//           <div style={{ display: 'grid', gridTemplateColumns: numPlayers === 1 ? 'repeat(1, 1fr)' : numPlayers === 2 ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(16px, 3vw, 32px)', marginTop: 'clamp(24px, 4vw, 48px)' }}>
//             {players.slice(0, numPlayers).map((player, idx) => (
//               <div key={idx} style={{ background: currentPlayer === idx && (gameState === 'playing' || gameState === 'betting') ? 'rgba(255, 215, 0, 0.1)' : 'transparent', borderRadius: '16px', padding: 'clamp(8px, 2vw, 16px)', border: currentPlayer === idx && (gameState === 'playing' || gameState === 'betting') ? '2px solid #ffd700' : 'none' }}>
//                 <div style={{ textAlign: 'center', marginBottom: '16px' }}>
//                   <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.4)', padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '9999px' }}>
//                     <div style={{ color: 'white', fontSize: 'clamp(14px, 2.5vw, 20px)', fontWeight: 'bold' }}>{player.name}</div>
//                     {player.isAI && player.aiStyle && (<div style={{ color: player.aiStyle === 'aggressive' ? '#ef4444' : player.aiStyle === 'optimal' ? '#a78bfa' : player.aiStyle === 'random' ? '#ec4899' : '#3b82f6', fontSize: 'clamp(11px, 2vw, 14px)', fontStyle: 'italic', marginTop: '4px' }}>{player.aiStyle === 'aggressive' ? '🔥 Aggressive AI' : player.aiStyle === 'optimal' ? '⭐ Optimal AI' : player.aiStyle === 'random' ? '🎲 Random AI' : '🛡️ Safe AI'}</div>)}
//                     <div style={{ color: '#fcd34d', fontSize: 'clamp(12px, 2vw, 16px)' }}>Score: {player.score}</div>
//                     <div style={{ color: '#22c55e', fontSize: 'clamp(11px, 1.8vw, 14px)' }}>Chips: ${player.chips}</div>
//                     {player.bet > 0 && <div style={{ color: '#ef4444', fontSize: 'clamp(11px, 1.8vw, 14px)' }}>Bet: ${player.bet}</div>}
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(4px, 1vw, 8px)', flexWrap: 'wrap' }}>
//                   {player.hand.map((card, i) => (<Card key={i} card={card} />))}
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Side Bets Section - Only for Player 1 during betting phase */}
//           {gameState === 'betting' && currentPlayer === 0 && (
//             <div style={{ marginTop: 'clamp(16px, 3vw, 32px)', textAlign: 'center' }}>
//               <div style={{ display: 'inline-block', background: 'rgba(139, 92, 246, 0.2)', border: '2px solid #8b5cf6', borderRadius: '16px', padding: 'clamp(12px, 2vw, 20px) clamp(16px, 3vw, 32px)', maxWidth: '90%' }}>
//                 <div style={{ color: '#a78bfa', fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 'bold', marginBottom: 'clamp(12px, 2vw, 16px)' }}>💎 Side Bets</div>
                
//                 {/* Pair Bet Section */}
//                 <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(139, 92, 246, 0.3)' }}>
//                   <div style={{ color: '#fcd34d', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 'bold', marginBottom: '8px' }}>
//                     🃏 Pair Bet
//                   </div>
//                   <div style={{ color: '#fcd34d', fontSize: 'clamp(10px, 1.8vw, 12px)', marginBottom: '12px' }}>
//                     Same rank: 5:1 | Suited pair: 20:1
//                   </div>
//                   {pairBet === 0 ? (
//                     <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 8px)', justifyContent: 'center', flexWrap: 'wrap' }}>
//                       <button onClick={() => placePairBet(5)} disabled={players[0].chips < 5} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 5 ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 5 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 5 ? 0.5 : 1 }}>$5</button>
//                       <button onClick={() => placePairBet(10)} disabled={players[0].chips < 10} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 10 ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 10 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 10 ? 0.5 : 1 }}>$10</button>
//                       <button onClick={() => placePairBet(25)} disabled={players[0].chips < 25} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 25 ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 25 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 25 ? 0.5 : 1 }}>$25</button>
//                     </div>
//                   ) : (
//                     <div style={{ color: '#a78bfa', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 'bold' }}>
//                       Pair: ${pairBet} ✓
//                     </div>
//                   )}
//                 </div>

//                 {/* Hot 3 Bet Section */}
//                 <div>
//                   <div style={{ color: '#fcd34d', fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 'bold', marginBottom: '8px' }}>
//                     🔥 Hot 3 Bet
//                   </div>
//                   <div style={{ color: '#fcd34d', fontSize: 'clamp(9px, 1.6vw, 11px)', marginBottom: '12px', lineHeight: '1.4' }}>
//                     Three 7s: 100:1 | Suited 21: 20:1 | 21: 4:1<br/>20: 2:1 | 19: 1:1
//                   </div>
//                   {hot3Bet === 0 ? (
//                     <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 8px)', justifyContent: 'center', flexWrap: 'wrap' }}>
//                       <button onClick={() => placeHot3Bet(5)} disabled={players[0].chips < 5} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 5 ? 'rgba(239, 68, 68, 0.3)' : 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 5 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 5 ? 0.5 : 1 }}>$5</button>
//                       <button onClick={() => placeHot3Bet(10)} disabled={players[0].chips < 10} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 10 ? 'rgba(239, 68, 68, 0.3)' : 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 10 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 10 ? 0.5 : 1 }}>$10</button>
//                       <button onClick={() => placeHot3Bet(25)} disabled={players[0].chips < 25} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(11px, 2vw, 13px)', color: 'white', background: players[0].chips < 25 ? 'rgba(239, 68, 68, 0.3)' : 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', border: '2px solid rgba(255,255,255,0.3)', cursor: players[0].chips < 25 ? 'not-allowed' : 'pointer', opacity: players[0].chips < 25 ? 0.5 : 1 }}>$25</button>
//                     </div>
//                   ) : (
//                     <div style={{ color: '#ef4444', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 'bold' }}>
//                       Hot 3: ${hot3Bet} ✓
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Pair Bet Outcome Display - Show during playing phase */}
//           {gameState === 'playing' && (pairBetOutcome || hot3BetOutcome) && (
//             <div style={{ marginTop: 'clamp(16px, 3vw, 24px)', textAlign: 'center' }}>
//               <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 16px)', justifyContent: 'center', flexWrap: 'wrap', padding: '0 8px' }}>
//                 {/* Pair Bet Outcome */}
//                 {pairBetOutcome && (
//                   <div style={{ display: 'inline-block', background: pairBetOutcome.won ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: pairBetOutcome.won ? '2px solid #22c55e' : '2px solid #ef4444', borderRadius: '12px', padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)', minWidth: 'clamp(150px, 30vw, 200px)' }}>
//                     <div style={{ color: pairBetOutcome.won ? '#22c55e' : '#ef4444', fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 'bold', marginBottom: '8px' }}>
//                       {pairBetOutcome.won ? '🃏 Pair WON!' : '❌ Pair Lost'}
//                     </div>
//                     <div style={{ color: '#fcd34d', fontSize: 'clamp(11px, 2vw, 13px)' }}>
//                       {pairBetOutcome.type}
//                       {pairBetOutcome.won && ` - $${pairBetOutcome.payout}`}
//                     </div>
//                   </div>
//                 )}
//                 {/* Hot 3 Bet Outcome */}
//                 {hot3BetOutcome && (
//                   <div style={{ display: 'inline-block', background: hot3BetOutcome.won ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: hot3BetOutcome.won ? '2px solid #22c55e' : '2px solid #ef4444', borderRadius: '12px', padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)', minWidth: 'clamp(150px, 30vw, 200px)' }}>
//                     <div style={{ color: hot3BetOutcome.won ? '#22c55e' : '#ef4444', fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 'bold', marginBottom: '8px' }}>
//                       {hot3BetOutcome.won ? '🔥 Hot 3 WON!' : '❌ Hot 3 Lost'}
//                     </div>
//                     <div style={{ color: '#fcd34d', fontSize: 'clamp(11px, 2vw, 13px)' }}>
//                       {hot3BetOutcome.type}
//                       {hot3BetOutcome.won && ` - $${hot3BetOutcome.payout}`}
//                     </div>
//                     <div style={{ color: '#a78bfa', fontSize: 'clamp(9px, 1.8vw, 11px)', marginTop: '4px' }}>
//                       Total: {hot3BetOutcome.total}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {gameState === 'playing' && currentPlayer === 0 && !aiThinking && (
//             <div style={{ textAlign: 'center', margin: 'clamp(16px, 3vw, 24px) 0' }}>
//               <button onClick={getBestMove} style={{ padding: 'clamp(10px, 2vw, 12px) clamp(20px, 3vw, 32px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(14px, 2.5vw, 18px)', color: 'white', background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', border: '2px solid #fbbf24', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}>💡 Best Move</button>
//               {bestMoveRecommendation && (
//                 <div style={{ marginTop: '16px', display: 'inline-block', background: 'rgba(245, 158, 11, 0.1)', border: '2px solid #f59e0b', borderRadius: '12px', padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)', maxWidth: '90%' }}>
//                   <div style={{ color: '#fbbf24', fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 'bold', marginBottom: '8px' }}>Recommended: {bestMoveRecommendation.action}</div>
//                   <div style={{ color: '#fcd34d', fontSize: 'clamp(12px, 2vw, 14px)', fontStyle: 'italic' }}>💭 {bestMoveRecommendation.reason}</div>
//                 </div>
//               )}
//             </div>
//           )}
//           <div style={{ marginTop: 'clamp(24px, 4vw, 48px)', display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap' }}>
//             {gameState === 'betting' && !players[currentPlayer].isAI && (
//               <>
//                 <button onClick={() => placeBet(10)} disabled={players[currentPlayer].chips < 10} style={{ padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(13px, 2.5vw, 16px)', color: 'white', background: '#dc2626', border: 'none', cursor: 'pointer', opacity: players[currentPlayer].chips < 10 ? 0.5 : 1 }}>Bet $10</button>
//                 <button onClick={() => placeBet(50)} disabled={players[currentPlayer].chips < 50} style={{ padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(13px, 2.5vw, 16px)', color: 'white', background: '#dc2626', border: 'none', cursor: 'pointer', opacity: players[currentPlayer].chips < 50 ? 0.5 : 1 }}>Bet $50</button>
//                 <button onClick={() => placeBet(100)} disabled={players[currentPlayer].chips < 100} style={{ padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)', borderRadius: '8px', fontWeight: 'bold', fontSize: 'clamp(13px, 2.5vw, 16px)', color: 'white', background: '#dc2626', border: 'none', cursor: 'pointer', opacity: players[currentPlayer].chips < 100 ? 0.5 : 1 }}>Bet $100</button>
//               </>
//             )}
//             {gameState === 'playing' && !players[currentPlayer].isAI && !aiThinking && (
//               <>
//                 <button onClick={() => hit()} style={{ padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 40px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(16px, 3vw, 20px)', color: 'white', background: '#dc2626', border: 'none', cursor: 'pointer' }}>Hit</button>
//                 <button onClick={() => stand()} style={{ padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 40px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(16px, 3vw, 20px)', color: 'white', background: '#16a34a', border: 'none', cursor: 'pointer' }}>Stand</button>
//                 {canDoubleDown() && (
//                   <button onClick={() => doubleDown()} style={{ padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 40px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(16px, 3vw, 20px)', color: 'white', background: '#2563eb', border: 'none', cursor: 'pointer' }}>Double</button>
//                 )}
//               </>
//             )}
//             {gameState === 'gameOver' && (
//               <button onClick={newRound} style={{ padding: 'clamp(12px, 2.5vw, 16px) clamp(24px, 4vw, 40px)', borderRadius: '12px', fontWeight: 'bold', fontSize: 'clamp(16px, 3vw, 20px)', color: 'white', background: '#f59e0b', border: 'none', cursor: 'pointer' }}>Next Round</button>
//             )}
//           </div>
//         </div>
//       </div>
//       <div style={{ position: 'fixed', bottom: 'clamp(8px, 2vw, 16px)', left: 'clamp(8px, 2vw, 16px)', background: 'rgba(0,0,0,0.9)', borderRadius: '12px', padding: 'clamp(8px, 1.5vw, 12px)', border: '2px solid #fbbf24', width: 'clamp(140px, 25vw, 200px)', maxWidth: '200px' }}>
//         <div style={{ color: '#ffd700', fontSize: 'clamp(10px, 2vw, 14px)', fontWeight: 'bold', marginBottom: '6px', textAlign: 'center' }}>Card Counter</div>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(2px, 0.5vw, 4px)' }}>
//           {values.map(value => (
//             <div key={value} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: 'clamp(2px, 0.5vw, 4px)', textAlign: 'center' }}>
//               <div style={{ color: 'white', fontSize: 'clamp(9px, 1.5vw, 12px)', fontWeight: 'bold', marginBottom: '2px' }}>{value}</div>
//               <div style={{ color: '#22c55e', fontSize: 'clamp(7px, 1.2vw, 9px)' }}>{groupedCounts[value].remaining}</div>
//               <div style={{ color: '#ef4444', fontSize: 'clamp(7px, 1.2vw, 9px)' }}>{groupedCounts[value].dealt}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {showMistakeLog && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
//           <div style={{ background: 'linear-gradient(180deg, #1a0505 0%, #4a0e0e 100%)', borderRadius: '16px', border: '3px solid #fbbf24', padding: 'clamp(16px, 3vw, 32px)', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
//               <h2 style={{ color: '#ffd700', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 'bold', margin: 0 }}>📋 Mistake Log</h2>
//               <button onClick={() => setShowMistakeLog(false)} style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white', fontSize: 'clamp(20px, 4vw, 24px)', cursor: 'pointer', borderRadius: '8px', width: 'clamp(32px, 6vw, 40px)', height: 'clamp(32px, 6vw, 40px)' }}>×</button>
//             </div>
//             {mistakes.length === 0 ? (
//               <div style={{ color: '#22c55e', fontSize: 'clamp(14px, 2.5vw, 18px)', textAlign: 'center', padding: '32px' }}>✓ No mistakes so far! Keep playing optimally!</div>
//             ) : (
//               <div>
//                 <div style={{ color: '#fcd34d', fontSize: 'clamp(12px, 2vw, 14px)', marginBottom: '16px', fontWeight: 'bold' }}>Total Mistakes: {mistakes.length}</div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                   {mistakes.map((mistake, idx) => (
//                     <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.4)', border: '2px solid #ef4444', borderRadius: '12px', padding: 'clamp(12px, 2vw, 16px)' }}>
//                       <div style={{ color: '#ef4444', fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 'bold', marginBottom: '8px' }}>Mistake #{idx + 1} - {mistake.timestamp}</div>
//                       <div style={{ color: '#fcd34d', fontSize: 'clamp(11px, 1.8vw, 13px)', marginBottom: '4px' }}>Your Hand: {mistake.hand}</div>
//                       <div style={{ color: '#fcd34d', fontSize: 'clamp(11px, 1.8vw, 13px)', marginBottom: '4px' }}>Your Score: {mistake.score} {mistake.soft ? '(soft)' : '(hard)'}</div>
//                       <div style={{ color: '#fcd34d', fontSize: 'clamp(11px, 1.8vw, 13px)', marginBottom: '8px' }}>Dealer: {mistake.dealerCard}</div>
//                       <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: 'clamp(8px, 1.5vw, 12px)', marginBottom: '8px' }}>
//                         <div style={{ color: '#ef4444', fontSize: 'clamp(10px, 1.8vw, 12px)', marginBottom: '4px' }}>❌ You played: <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{mistake.playerAction}</span></div>
//                         <div style={{ color: '#22c55e', fontSize: 'clamp(10px, 1.8vw, 12px)', marginBottom: '4px' }}>✓ Optimal play: <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{mistake.optimalAction}</span></div>
//                         <div style={{ color: '#a78bfa', fontSize: 'clamp(10px, 1.8vw, 12px)', fontStyle: 'italic', marginTop: '8px' }}>💡 {mistake.reason}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default BlackjackGame;