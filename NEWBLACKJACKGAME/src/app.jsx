
import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ModeSelect from './components/ModeSelect';
import AISelect from './components/AISelect';
import { createDeck, shuffleDeck, dealCard, calculateScore } from './utils/cardUtils';

const App = () => {
  // Game state
  const [deck, setDeck] = useState([]);
  const [dealtCards, setDealtCards] = useState([]);
  const [numPlayers, setNumPlayers] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('modeSelect');
  const [message, setMessage] = useState('Select number of players');
  const [dealerScore, setDealerScore] = useState(0);
  
  // Player state
  const [players, setPlayers] = useState([
    { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 1', isAI: false, aiStyle: null },
    { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 2', isAI: true, aiStyle: null },
    { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 3', isAI: true, aiStyle: null }
  ]);
  
  // AI state
  const [aiThinking, setAiThinking] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [selectedAIStyles, setSelectedAIStyles] = useState({ player2: null, player3: null });
  
  // Mistakes and recommendations
  const [mistakes, setMistakes] = useState([]);
  const [showMistakeLog, setShowMistakeLog] = useState(false);
  const [bestMoveRecommendation, setBestMoveRecommendation] = useState(null);
  
  // Side bets
  const [pairBet, setPairBet] = useState(0);
  const [pairBetOutcome, setPairBetOutcome] = useState(null);
  const [hot3Bet, setHot3Bet] = useState(0);
  const [hot3BetOutcome, setHot3BetOutcome] = useState(null);

  // Initialize deck on mount
  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const selectMode = (num) => {
    setNumPlayers(num);
    if (num === 1) {
      setGameState('betting');
      setMessage('Place your bet');
    } else {
      setGameState('aiSelect');
      setMessage('Select AI play styles');
    }
    const newPlayers = [...players];
    for (let i = 0; i < num; i++) {
      newPlayers[i] = { 
        hand: [], 
        score: 0, 
        chips: 10000, 
        bet: 0, 
        name: `Player ${i + 1}`,
        isAI: i > 0,
        aiStyle: null
      };
    }
    setPlayers(newPlayers);
    setCurrentPlayer(0);
  };

  const confirmAIStyles = () => {
    const newPlayers = [...players];
    if (numPlayers >= 2) {
      newPlayers[1].aiStyle = selectedAIStyles.player2;
    }
    if (numPlayers >= 3) {
      newPlayers[2].aiStyle = selectedAIStyles.player3;
    }
    setPlayers(newPlayers);
    setGameState('betting');
    setMessage('Place your bets');
  };

  const endGame = () => {
    setNumPlayers(null);
    setCurrentPlayer(0);
    setDealerHand([]);
    setDealerScore(0);
    setDealtCards([]);
    setGameState('modeSelect');
    setMessage('Select number of players');
    setDeck(createDeck());
    setSelectedAIStyles({ player2: null, player3: null });
    setMistakes([]);
    setShowMistakeLog(false);
    setPairBet(0);
    setPairBetOutcome(null);
    setHot3Bet(0);
    setHot3BetOutcome(null);
    const newPlayers = [
      { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 1', isAI: false, aiStyle: null },
      { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 2', isAI: true, aiStyle: null },
      { hand: [], score: 0, chips: 10000, bet: 0, name: 'Player 3', isAI: true, aiStyle: null }
    ];
    setPlayers(newPlayers);
  };

  const newRound = () => {
    setDealerHand([]);
    setGameState('betting');
    setMessage('Place your bets');
    setCurrentPlayer(0);
    setDealerScore(0);
    setBestMoveRecommendation(null);
    setPairBet(0);
    setPairBetOutcome(null);
    setHot3Bet(0);
    setHot3BetOutcome(null);
    const newPlayers = [...players];
    for (let i = 0; i < numPlayers; i++) {
      newPlayers[i].hand = [];
      newPlayers[i].score = 0;
      newPlayers[i].bet = 0;
    }
    setPlayers(newPlayers);
  };

  // Render appropriate screen based on game state
  if (gameState === 'modeSelect') {
    return <ModeSelect onSelectMode={selectMode} />;
  }

  if (gameState === 'aiSelect') {
    return (
      <AISelect
        numPlayers={numPlayers}
        selectedAIStyles={selectedAIStyles}
        setSelectedAIStyles={setSelectedAIStyles}
        onConfirm={confirmAIStyles}
        onBack={() => {
          setGameState('modeSelect');
          setSelectedAIStyles({ player2: null, player3: null });
        }}
      />
    );
  }

  return (
    <GameBoard
      // Game state
      gameState={gameState}
      setGameState={setGameState}
      message={message}
      setMessage={setMessage}
      
      // Deck state
      deck={deck}
      setDeck={setDeck}
      dealtCards={dealtCards}
      setDealtCards={setDealtCards}
      
      // Player state
      players={players}
      setPlayers={setPlayers}
      numPlayers={numPlayers}
      currentPlayer={currentPlayer}
      setCurrentPlayer={setCurrentPlayer}
      
      // Dealer state
      dealerHand={dealerHand}
      setDealerHand={setDealerHand}
      dealerScore={dealerScore}
      setDealerScore={setDealerScore}
      
      // AI state
      aiThinking={aiThinking}
      setAiThinking={setAiThinking}
      aiExplanation={aiExplanation}
      setAiExplanation={setAiExplanation}
      
      // Mistakes
      mistakes={mistakes}
      setMistakes={setMistakes}
      showMistakeLog={showMistakeLog}
      setShowMistakeLog={setShowMistakeLog}
      bestMoveRecommendation={bestMoveRecommendation}
      setBestMoveRecommendation={setBestMoveRecommendation}
      
      // Side bets
      pairBet={pairBet}
      setPairBet={setPairBet}
      pairBetOutcome={pairBetOutcome}
      setPairBetOutcome={setPairBetOutcome}
      hot3Bet={hot3Bet}
      setHot3Bet={setHot3Bet}
      hot3BetOutcome={hot3BetOutcome}
      setHot3BetOutcome={setHot3BetOutcome}
      
      // Actions
      onEndGame={endGame}
      onNewRound={newRound}
    />
  );
};

export default App;