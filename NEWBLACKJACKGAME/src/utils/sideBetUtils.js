// Side bet evaluation utilities
import { calculateScore } from './cardUtils';

export const evaluatePairBet = (hand, pairBet) => {
  if (pairBet === 0 || hand.length < 2) return null;

  const card1 = hand[0];
  const card2 = hand[1];

  // Check if same rank
  if (card1.value === card2.value) {
    // Check if suited
    if (card1.suit === card2.suit) {
      // Suited pair - 20:1
      const winAmount = pairBet * 20;
      return { won: true, payout: winAmount, type: 'Suited Pair', totalReturn: pairBet + winAmount };
    } else {
      // Same rank, different suit - 5:1
      const winAmount = pairBet * 5;
      return { won: true, payout: winAmount, type: 'Pair', totalReturn: pairBet + winAmount };
    }
  } else {
    // Lost
    return { won: false, payout: 0, type: 'No Pair', totalReturn: 0 };
  }
};

export const evaluateHot3Bet = (playerHand, dealerUpCard, hot3Bet) => {
  if (hot3Bet === 0 || playerHand.length < 2 || !dealerUpCard) return null;

  // Combine player's two cards and dealer's up card
  const threeCards = [...playerHand.slice(0, 2), dealerUpCard];
  
  // Calculate total using blackjack scoring
  let total = 0;
  let aces = 0;
  
  for (let card of threeCards) {
    if (card.value === 'A') {
      aces += 1;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }
  
  // Adjust for aces if needed
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  
  // Check for three 7s
  const allSevens = threeCards.every(card => card.value === '7');
  
  // Check for suited 21 (all same suit)
  const allSameSuit = threeCards.every(card => card.suit === threeCards[0].suit);
  const suited21 = total === 21 && allSameSuit;
  
  if (allSevens) {
    // Three 7s - 100:1
    const winAmount = hot3Bet * 100;
    return { won: true, payout: winAmount, type: 'Three 7s! 🎰', total, totalReturn: hot3Bet + winAmount };
  } else if (suited21) {
    // Suited 21 - 20:1
    const winAmount = hot3Bet * 20;
    return { won: true, payout: winAmount, type: 'Suited 21! ♠️', total, totalReturn: hot3Bet + winAmount };
  } else if (total === 21) {
    // Any 21 - 4:1
    const winAmount = hot3Bet * 4;
    return { won: true, payout: winAmount, type: 'Twenty-One!', total, totalReturn: hot3Bet + winAmount };
  } else if (total === 20) {
    // 20 - 2:1
    const winAmount = hot3Bet * 2;
    return { won: true, payout: winAmount, type: 'Twenty', total, totalReturn: hot3Bet + winAmount };
  } else if (total === 19) {
    // 19 - 1:1
    const winAmount = hot3Bet * 1;
    return { won: true, payout: winAmount, type: 'Nineteen', total, totalReturn: hot3Bet + winAmount };
  } else {
    // Lost
    return { won: false, payout: 0, type: 'No Win', total, totalReturn: 0 };
  }
};