// Card utility functions

export const suits = ['♥', '♦', '♣', '♠'];
export const suitNames = ['hearts', 'diamonds', 'clubs', 'spades'];
export const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const getSuitColor = (suit) => {
  return suit === '♥' || suit === '♦' ? '#dc2626' : '#000000';
};

export const createDeck = () => {
  const newDeck = [];
  for (let deckNum = 0; deckNum < 6; deckNum++) {
    for (let i = 0; i < suitNames.length; i++) {
      for (let value of values) {
        newDeck.push({ suit: suits[i], suitName: suitNames[i], value });
      }
    }
  }
  return shuffleDeck(newDeck);
};

export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateScore = (hand) => {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === 'A') {
      aces += 1;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }
  return score;
};

export const dealCard = (currentDeck, currentDealtCards) => {
  const newDeck = [...currentDeck];
  const card = newDeck.pop();
  const newDealtCards = [...currentDealtCards, card];
  return { card, newDeck, newDealtCards };
};

export const getCardCount = (dealtCards) => {
  const cardCounts = {};
  for (let suit of suits) {
    for (let value of values) {
      const key = `${value}${suit}`;
      cardCounts[key] = { dealt: 0, remaining: 6 };
    }
  }
  for (let card of dealtCards) {
    const key = `${card.value}${card.suit}`;
    if (cardCounts[key]) {
      cardCounts[key].dealt += 1;
      cardCounts[key].remaining = 6 - cardCounts[key].dealt;
    }
  }
  return cardCounts;
};

export const getGroupedCardCounts = (cardCounts) => {
  const groupedCounts = {};
  values.forEach(value => {
    groupedCounts[value] = { dealt: 0, remaining: 0 };
    suits.forEach(suit => {
      const key = `${value}${suit}`;
      groupedCounts[value].dealt += cardCounts[key].dealt;
      groupedCounts[value].remaining += cardCounts[key].remaining;
    });
  });
  return groupedCounts;
};