// AI decision-making utilities
import { calculateScore } from './cardUtils';

export const getRandomStyle = () => {
  const styles = ['aggressive', 'optimal', 'safe'];
  return styles[Math.floor(Math.random() * styles.length)];
};

export const getAIDecision = async (hand, dealerUpCard, chips, bet, playStyle, playerName) => {
  const score = calculateScore(hand);
  const dealerValue = dealerUpCard.value === 'A' ? 11 : ['K', 'Q', 'J'].includes(dealerUpCard.value) ? 10 : parseInt(dealerUpCard.value);
  const canDouble = hand.length === 2 && chips >= bet;
  const hasAce = hand.some(c => c.value === 'A');
  const isSoft = hasAce && score <= 21;
  
  // If random, pick a random style for this decision
  let decisionStyle = playStyle;
  if (playStyle === 'random') {
    decisionStyle = getRandomStyle();
  }
  
  const aggressivePrompt = `You are an aggressive blackjack player. Always hit if total is 16 or less. Hit on soft 17. Double frequently. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;
  const safePrompt = `You are a safe blackjack player. Stand on 15+. Stand on 12+ vs strong dealer. Only double 10-11 vs weak dealer. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;
  const optimalPrompt = `You are playing optimal blackjack basic strategy. Hard hands: stand 17+, hit 16 vs 7-A, hit 12-16 vs 4-6 only. Soft hands: stand 19+, stand 18 vs 6 or less, hit 17 or less vs 7-A. Double 11 vs all except A, 10 vs 2-9, 9 vs 3-6. Current: ${playerName} hand ${hand.map(c => c.value + c.suit).join(', ')}, score ${score} ${isSoft ? '(soft)' : ''}, dealer ${dealerUpCard.value}${dealerUpCard.suit}, can double ${canDouble}. Respond ONLY: ACTION: [HIT/STAND/DOUBLE] - REASON: [10 words max]`;

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    let selectedPrompt = safePrompt;
    let temperature = 0.3;
    
    if (decisionStyle === 'aggressive') {
      selectedPrompt = aggressivePrompt;
      temperature = 0.9;
    } else if (decisionStyle === 'optimal') {
      selectedPrompt = optimalPrompt;
      temperature = 0.1;
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: selectedPrompt }] }],
        generationConfig: { temperature: temperature, maxOutputTokens: 100 }
      })
    });
    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    const actionMatch = responseText.match(/ACTION:\s*(HIT|STAND|DOUBLE)/i);
    const reasonMatch = responseText.match(/REASON:\s*(.+)/i);
    return { action: actionMatch ? actionMatch[1].toUpperCase() : 'STAND', reason: reasonMatch ? reasonMatch[1].trim() : 'Following strategy' };
  } catch (error) {
    console.error('AI Error:', error);
    return getRuleBasedDecision(hand, dealerUpCard, chips, bet, decisionStyle);
  }
};

export const getRuleBasedDecision = (hand, dealerUpCard, chips, bet, playStyle) => {
  const score = calculateScore(hand);
  const dealerValue = dealerUpCard.value === 'A' ? 11 : ['K', 'Q', 'J'].includes(dealerUpCard.value) ? 10 : parseInt(dealerUpCard.value);
  const canDouble = hand.length === 2 && chips >= bet;
  const hasAce = hand.some(c => c.value === 'A');
  const isSoft = hasAce && score <= 21;

  if (playStyle === 'aggressive') {
    if (canDouble && (score === 10 || score === 11)) return { action: 'DOUBLE', reason: 'Double down!' };
    if (isSoft && score === 17) return { action: 'HIT', reason: 'Soft 17, hitting' };
    if (score <= 16) return { action: 'HIT', reason: 'Fortune favors bold!' };
    return { action: 'STAND', reason: 'Got strong hand' };
  } else if (playStyle === 'optimal') {
    // Optimal Basic Strategy
    // Hard Totals
    if (!isSoft) {
      if (score >= 17) return { action: 'STAND', reason: 'Hard 17 or higher' };
      if (score === 16) {
        if (dealerValue >= 7) return { action: 'HIT', reason: 'Hard 16 vs strong dealer' };
        return { action: 'STAND', reason: 'Hard 16 vs weak dealer' };
      }
      if (score === 15) {
        if (dealerValue >= 7) return { action: 'HIT', reason: 'Hard 15 vs strong dealer' };
        return { action: 'STAND', reason: 'Hard 15 vs weak dealer' };
      }
      if (score === 14 || score === 13 || score === 12) {
        if (dealerValue >= 4 && dealerValue <= 6) return { action: 'STAND', reason: 'Stand vs weak dealer' };
        return { action: 'HIT', reason: 'Hit vs strong dealer' };
      }
      if (score <= 11) return { action: 'HIT', reason: 'Cannot bust' };
    }
    // Soft Totals
    else {
      if (score >= 19) return { action: 'STAND', reason: 'Soft 19 or higher' };
      if (score === 18) {
        if (dealerValue >= 7) return { action: 'HIT', reason: 'Soft 18 vs strong dealer' };
        return { action: 'STAND', reason: 'Soft 18 vs weak dealer' };
      }
      if (score === 17 || score === 16 || score === 15) {
        if (dealerValue >= 4 && dealerValue <= 6 && canDouble) return { action: 'DOUBLE', reason: 'Double soft hand vs weak dealer' };
        return { action: 'HIT', reason: 'Hit soft hand' };
      }
      if (score <= 14) return { action: 'HIT', reason: 'Hit low soft hand' };
    }
    // Double Down Opportunities
    if (canDouble && hand.length === 2) {
      if (score === 11) {
        if (dealerValue !== 11) return { action: 'DOUBLE', reason: 'Double 11 vs all except A' };
      }
      if (score === 10 && dealerValue >= 2 && dealerValue <= 9) return { action: 'DOUBLE', reason: 'Double 10 vs weak dealer' };
      if (score === 9 && dealerValue >= 3 && dealerValue <= 6) return { action: 'DOUBLE', reason: 'Double 9 vs weak dealer' };
    }
    return { action: 'STAND', reason: 'Following basic strategy' };
  } else {
    // Safe play style
    if (score >= 15) return { action: 'STAND', reason: 'Playing safe on 15+' };
    if (score >= 12) return { action: 'STAND', reason: 'Better safe than bust' };
    if (canDouble && score === 11 && dealerValue >= 4 && dealerValue <= 6) return { action: 'DOUBLE', reason: 'Safe double' };
    if (score <= 11) return { action: 'HIT', reason: 'Cannot bust' };
    return { action: 'STAND', reason: 'Preserving total' };
  }
};

export const checkForMistake = (hand, dealerUpCard, action, chips, bet) => {
  const optimalDecision = getRuleBasedDecision(hand, dealerUpCard, chips, bet, 'optimal');
  if (optimalDecision.action !== action) {
    const score = calculateScore(hand);
    const hasAce = hand.some(c => c.value === 'A');
    const isSoft = hasAce && score <= 21;
    
    return {
      hand: `${hand.map(c => c.value + c.suit).join(', ')}`,
      score: score,
      soft: isSoft,
      dealerCard: `${dealerUpCard.value}${dealerUpCard.suit}`,
      playerAction: action,
      optimalAction: optimalDecision.action,
      reason: optimalDecision.reason,
      timestamp: new Date().toLocaleTimeString()
    };
  }
  return null;
};

export const getAIBetAmount = (player) => {
  if (player.aiStyle === 'aggressive') {
    return 100;
  } else if (player.aiStyle === 'optimal' || player.aiStyle === 'random') {
    return 75;
  } else {
    return 50; // Safe play
  }
};