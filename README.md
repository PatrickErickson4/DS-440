# Multiplayer Blackjack Game - Code Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [State Management](#state-management)
4. [Core Functions](#core-functions)
5. [Game Flow](#game-flow)
6. [AI System](#ai-system)
7. [Side Bets](#side-bets)
8. [UI Components](#ui-components)
9. [Mobile Responsiveness](#mobile-responsiveness)

---

## 🎮 Overview

A comprehensive multiplayer blackjack game built with React featuring:
- **1-3 players** (Player 1 is human, others are AI)
- **AI opponents** with multiple play styles (Aggressive, Optimal, Safe, Random)
- **Side bets**: Pair (5:1, 20:1) and Hot 3 (up to 100:1)
- **6-deck shoe** with live card counting display
- **Mistake tracking** with optimal strategy recommendations
- **Fully responsive** mobile design
- **Gemini AI integration** for realistic AI decision-making

---

## 🏗️ Architecture

### File Structure
```
app.jsx (1200+ lines)
├── Imports & Setup
├── State Management (38 state variables)
├── Constants (suits, values, card definitions)
├── Utility Functions (deck creation, scoring, card dealing)
├── AI Decision System (Gemini API + rule-based fallback)
├── Game Flow Functions (mode selection, betting, dealing)
├── Player Actions (hit, stand, double down)
├── Side Bets Logic (Pair & Hot 3 evaluation)
├── Strategy & Mistakes Tracking
├── UI Rendering (3 main screens + modals)
└── Export
```

### Technology Stack
- **React** 18+ with Hooks (useState, useEffect)
- **Gemini AI API** for intelligent AI opponents
- **Inline CSS** with responsive clamp() functions
- **No external UI libraries** - pure React components

---

## 📊 State Management

### Game State Variables
```javascript
// Core Game State
gameState        // 'modeSelect' | 'aiSelect' | 'betting' | 'playing' | 'dealerTurn' | 'gameOver'
numPlayers       // 1, 2, or 3
currentPlayer    // Index of active player (0-2)
message          // Current game message displayed to user

// Deck & Cards
deck            // Array of remaining cards (6-deck shoe = 312 cards)
dealtCards      // Array of all dealt cards (for card counting)

// Dealer
dealerHand      // Array of dealer's cards
dealerScore     // Dealer's calculated score

// Players Array (3 player objects)
players: [{
  hand: [],           // Array of card objects
  score: 0,          // Current hand value
  chips: 10000,      // Available chips
  bet: 0,            // Current bet amount
  name: 'Player X',  // Display name
  isAI: boolean,     // Is this an AI player?
  aiStyle: string    // 'aggressive' | 'optimal' | 'safe' | 'random' | null
}]

// AI State
aiThinking          // Boolean - is AI currently deciding?
aiExplanation       // String - AI's reasoning display
selectedAIStyles    // Object - selected styles for player 2 & 3

// Strategy & Education
mistakes            // Array of mistake objects for tracking
showMistakeLog      // Boolean - modal visibility
bestMoveRecommendation  // Object with optimal move suggestion

// Side Bets
pairBet            // Amount bet on Pair
pairBetOutcome     // Result object {won, payout, type}
hot3Bet            // Amount bet on Hot 3
hot3BetOutcome     // Result object {won, payout, type, total}
```

---

## 🔧 Core Functions

### 1. Deck Management

#### `createDeck()`
Creates a 6-deck shoe (312 cards total) and shuffles it.
```javascript
// Creates 6 complete decks
// Returns shuffled array of card objects
// Card object: { suit, suitName, value }
```

#### `shuffleDeck(deck)`
Uses Fisher-Yates algorithm for truly random shuffle.
```javascript
// Time complexity: O(n)
// In-place shuffle with no bias
```

#### `dealCard(currentDeck, currentDealtCards)`
Deals one card from the deck and tracks it.
```javascript
// Returns: { card, newDeck, newDealtCards }
// Updates card counting automatically
```

### 2. Scoring

#### `calculateScore(hand)`
Calculates optimal blackjack score for a hand.
```javascript
// Rules:
// - Aces count as 11 or 1 (whichever is better)
// - Face cards (J, Q, K) count as 10
// - Number cards count as face value
// - Automatically adjusts aces to prevent busting
// Returns: Best possible score without busting
```

**Example:**
```javascript
// A♥ + K♠ = 21 (blackjack)
// A♥ + 5♦ + 5♣ = 21 (ace counts as 11)
// A♥ + 5♦ + K♠ = 16 (ace counts as 1)
```

### 3. Card Counting

#### `getCardCount()`
Tracks dealt vs remaining cards for each value.
```javascript
// Returns object with counts for all 52 unique cards
// Used for card counter display in bottom-left
// Format: { 'A♥': {dealt: 2, remaining: 4}, ... }
```

---

## 🎯 Game Flow

### Phase 1: Mode Selection
```
User selects: Solo (1) | 2 Players | 3 Players
↓
Solo → Go to Betting
Multiplayer → Go to AI Style Selection
```

### Phase 2: AI Style Selection (Multiplayer Only)
```
User selects AI style for Player 2 (and Player 3 if 3-player):
- 🔥 Aggressive: Risky, hits frequently, doubles often
- ⭐ Optimal: Basic strategy, mathematically correct
- 🛡️ Safe: Conservative, stands early
- 🎲 Random: Randomly picks style each decision
↓
Confirm → Go to Betting
```

### Phase 3: Betting
```
For each player (in order):
  1. Display "Player X, place your bet"
  2. Human players: Show bet buttons ($10, $50, $100)
  3. AI players: Auto-bet based on style
     - Aggressive: $100
     - Optimal/Random: $75
     - Safe: $50
  4. Player 1 only: Option to place side bets (Pair, Hot 3)
↓
All bets placed → Deal initial cards
```

### Phase 4: Initial Deal
```
Deal order:
1. First card to each player (left to right)
2. First card to dealer (visible)
3. Second card to each player
4. Second card to dealer (hidden)
↓
Calculate all scores
Evaluate Player 1's side bets
↓
Start Player 1's turn
```

### Phase 5: Player Turns
```
For each player (Player 1 → 2 → 3):
  While not bust and not standing:
    Human players:
      - Show buttons: Hit, Stand, Double (if eligible)
      - Show "Best Move" button
      - Track mistakes vs optimal strategy
    
    AI players:
      - Display "AI is thinking..."
      - Call getAIDecision() (Gemini API or rule-based)
      - Display AI's reasoning
      - Execute decision after 2 second delay
  
  Check results:
    - Bust (>21): Lose bet, next player
    - 21: Automatic stand, next player
    - Stand: Next player
↓
All players done → Dealer's turn
```

### Phase 6: Dealer's Turn
```
Reveal hidden card
While score < 17:
  Hit (dealer must hit on 16 or less)
↓
Calculate final score
↓
Determine winners
```

### Phase 7: Determine Winners
```
For each player:
  If player bust:
    Player loses bet
  Else if dealer bust:
    Player wins 2:1
  Else if player score > dealer score:
    Player wins 2:1
  Else if player score < dealer score:
    Player loses bet
  Else:
    Push (return bet)
↓
Display results
Show "Next Round" button
```

---

## 🤖 AI System

### Decision Making Process

#### 1. AI Decision Request
```javascript
getAIDecision(hand, dealerUpCard, chips, bet, playStyle, playerName)
```

#### 2. Gemini API Call (Primary)
```
Construct style-specific prompt:
- Aggressive: "Always hit on 16 or less, double frequently"
- Optimal: "Follow basic strategy: [detailed rules]"
- Safe: "Stand on 15+, minimal risk"

Send to Gemini API with appropriate temperature:
- Aggressive: 0.9 (more random)
- Optimal: 0.1 (very consistent)
- Safe: 0.3 (somewhat consistent)

Parse response for ACTION and REASON
```

#### 3. Rule-Based Fallback (if API fails)
Uses `getRuleBasedDecision()` with these strategies:

**Aggressive Strategy:**
- Double on 10 or 11
- Hit on soft 17
- Hit on anything ≤16
- Stand otherwise

**Optimal Strategy (Basic Strategy):**
Hard totals:
- Stand on 17+
- Hit on 16 vs dealer 7-A
- Stand on 16 vs dealer 2-6
- Stand on 13-15 vs dealer 4-6
- Hit otherwise

Soft totals:
- Stand on 19+
- Hit soft 18 vs dealer 7+
- Stand soft 18 vs dealer 2-6
- Hit soft 17 or less

Double down:
- 11 vs any dealer except A
- 10 vs dealer 2-9
- 9 vs dealer 3-6

**Safe Strategy:**
- Stand on 15+
- Stand on 12+
- Only double 11 vs weak dealer (4-6)

#### 4. Random Style
Picks a random style (aggressive/optimal/safe) for each decision, creating unpredictable gameplay.

---

## 💎 Side Bets

### Pair Bet
**Evaluated:** After initial deal (Player 1's first 2 cards)

**Payouts:**
- Same rank, different suit: **5:1**
- Same rank, same suit (suited pair): **20:1**
- Different ranks: **Lose bet**

**Examples:**
- 7♥ + 7♦ = 5:1
- 7♥ + 7♥ = 20:1 (suited pair)
- 7♥ + 8♥ = Lose

### Hot 3 Bet
**Evaluated:** After initial deal (Player 1's 2 cards + dealer's up card)

**Payouts:**
- Three 7s (any suits): **100:1** 🎰
- 21 with all same suit: **20:1** ♠️
- 21 with mixed suits: **4:1**
- 20: **2:1**
- 19: **1:1**
- Any other total: **Lose bet**

**Examples:**
- 7♥ + 7♦ + 7♠ = 100:1 (three 7s)
- A♠ + K♠ + Q♠ = 20:1 (suited 21)
- A♥ + K♠ + Q♦ = 4:1 (21 mixed)
- 10♥ + 5♦ + 5♣ = 2:1 (20)
- 9♥ + 5♦ + 5♣ = 1:1 (19)
- 8♥ + 5♦ + 5♣ = Lose (18)

**Scoring:** Uses blackjack scoring (Aces can be 11 or 1)

---

## 📚 Strategy & Mistake Tracking

### Mistake Detection

#### `checkForMistake(hand, dealerUpCard, action, chips, bet)`
Compares player's action against optimal basic strategy.

**Tracks:**
- Player's hand and score (hard/soft)
- Dealer's up card
- Player's action (HIT/STAND/DOUBLE)
- Optimal action
- Reason why optimal action is better
- Timestamp

**Example Mistake:**
```javascript
{
  hand: "K♥, 6♦",
  score: 16,
  soft: false,
  dealerCard: "10♠",
  playerAction: "STAND",
  optimalAction: "HIT",
  reason: "Hard 16 vs strong dealer",
  timestamp: "2:34:15 PM"
}
```

### Best Move Recommendation

#### `getBestMove()`
Shows optimal move for current situation without penalty.

**Use cases:**
- Learning basic strategy
- Checking decision before acting
- Educational tool for new players

---

## 🎨 UI Components

### 1. Mode Selection Screen
- Large title with gold gradient
- Three buttons: Solo, 2 Players, 3 Players
- Fully responsive sizing

### 2. AI Style Selection Screen
- Card-style selectors for each AI player
- 4 styles with emoji indicators
- Disabled start button until all styles selected
- Back button to return to mode selection

### 3. Main Game Table
**Layout:**
```
┌─────────────────────────────────────┐
│  [Mistakes]        [End Game]       │
│                                      │
│           Blackjack Table            │
│        Cards: 234 | Dealt: 78        │
│                                      │
│  ┌───────────────────────────────┐  │
│  │         Dealer                 │  │
│  │        Value: 10               │  │
│  │       [🂡] [?]                 │  │
│  └───────────────────────────────┘  │
│                                      │
│         Current Message              │
│                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │Player│  │Player│  │Player│      │
│  │  1   │  │  2   │  │  3   │      │
│  │ ...  │  │ ...  │  │ ...  │      │
│  └──────┘  └──────┘  └──────┘      │
│                                      │
│        [Side Bets Panel]             │
│     (Only Player 1, betting)         │
│                                      │
│      [Side Bet Outcomes]             │
│      (During play phase)             │
│                                      │
│      [Hit] [Stand] [Double]          │
│                                      │
└─────────────────────────────────────┘
 [Card Counter]
```

### 4. Card Counter (Bottom-Left)
Shows dealt vs remaining cards for each value (A-K).
- Green: Remaining cards
- Red: Dealt cards
- Updates live during play

### 5. Mistake Log Modal
Full-screen overlay showing all mistakes:
- Hand dealt
- Dealer's card
- Player's action vs optimal
- Explanation of optimal play
- Timestamp

---

## 📱 Mobile Responsiveness

### Responsive Typography
All font sizes use `clamp()` for smooth scaling:
```css
clamp(minSize, preferredSize, maxSize)

Examples:
- Title: clamp(36px, 10vw, 72px)
- Buttons: clamp(16px, 3vw, 20px)
- Cards: clamp(14px, 2.5vw, 24px)
```

### Responsive Layouts

**Cards:**
- Mobile: 60px × 90px
- Desktop: 96px × 144px

**Player Grid:**
- Mobile: Stacks vertically
- Tablet: 2 columns
- Desktop: 3 columns (auto-fit)

**Buttons:**
- Touch-friendly sizing (minimum 44px tap target)
- Proper spacing for fat-finger prevention

**Modals:**
- Full viewport with padding
- Scrollable content areas
- Large close buttons

### Breakpoints
- Mobile: ≤768px
- Tablet: 769-1024px
- Desktop: ≥1025px

---

## 🔑 Key Code Patterns

### 1. Immutable State Updates
```javascript
// Always create new arrays/objects
const newPlayers = [...players];
newPlayers[0].chips += winnings;
setPlayers(newPlayers);
```

### 2. AI Turn Handling
```javascript
// Uses setTimeout for realistic delays
setTimeout(() => {
  handleAITurn(players, nextIdx, deck, dealtCards, dealerHand);
}, 1000);
```

### 3. Conditional Rendering
```javascript
// Three main screens
if (gameState === 'modeSelect') return <ModeScreen />;
if (gameState === 'aiSelect') return <AIScreen />;
return <MainGame />;
```

### 4. Player Index Handling
```javascript
// Functions accept optional playerIndex parameter
const hit = (playerIndex = null) => {
  const actualPlayerIndex = playerIndex !== null ? playerIndex : currentPlayer;
  // Use actualPlayerIndex for operations
};
```

---

## 🐛 Common Issues & Solutions

### Issue: AI doesn't make decisions
**Solution:** Check Gemini API key in `.env` file:
```
VITE_GEMINI_API_KEY=your_key_here
```

### Issue: Cards not displaying correctly
**Solution:** Ensure card objects have both `suit` and `value` properties.

### Issue: Side bets not evaluating
**Solution:** Check that side bets are placed BEFORE initial deal.

### Issue: Deck runs out of cards
**Solution:** Deck auto-reshuffles when <15 cards remain.

---

## 🚀 Future Enhancements

Potential features to add:
1. **Split hands** - When player has pair
2. **Insurance** - When dealer shows Ace
3. **Surrender** - Give up half bet
4. **Statistics tracking** - Win rate, average bet, etc.
5. **Multiplayer online** - Real multiplayer via WebSockets
6. **Sound effects** - Card dealing, chip sounds
7. **Animations** - Card dealing animations
8. **Save/Load** - Persist game state
9. **Leaderboard** - High scores tracking
10. **More side bets** - 21+3, Perfect Pairs, etc.

---

## 📝 Code Maintenance Tips

### Adding New AI Styles
1. Add style to `getRandomStyle()` array
2. Create prompt in `getAIDecision()`
3. Add rule-based logic in `getRuleBasedDecision()`
4. Add UI button in AI selection screen

### Adding New Side Bets
1. Add state variables (`[betName]Bet`, `[betName]BetOutcome`)
2. Create `place[BetName]Bet()` function
3. Create `evaluate[BetName]Bet()` function
4. Call evaluation in `startGame()`
5. Add UI in betting section
6. Add outcome display
7. Reset in `newRound()` and `endGame()`

### Modifying Payouts
All payout logic is in evaluation functions:
- `evaluatePairBet()` - Line ~890
- `evaluateHot3Bet()` - Line ~920
- `determineWinners()` - Line ~780

---

## 📞 Support & Questions

For questions about the code:
1. Check this README first
2. Review inline comments in code
3. Test in browser console for debugging
4. Check browser developer tools for errors

---

**Version:** 2.0  
**Last Updated:** 2025  
**Lines of Code:** ~1200  
**Language:** JavaScript (React)
