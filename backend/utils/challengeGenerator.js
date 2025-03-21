import crypto from 'crypto';

export const generateChallenge = () => {
  const challenge = {
    id: crypto.randomBytes(16).toString('hex'),
    a: Math.floor(Math.random() * 100),
    b: Math.floor(Math.random() * 100),
    operation: Math.random() > 0.5 ? '+' : '*',
    timestamp: Date.now()
  };
  
  // Calculate expected answer
  challenge.expected = challenge.operation === '+' 
    ? challenge.a + challenge.b 
    : challenge.a * challenge.b;
    
  return challenge;
};

export const verifyChallengeResponse = (challenge, response) => {
  // Check if challenge is expired (15 seconds)
  if (Date.now() - challenge.timestamp > 15000) {
    return false;
  }
  
  return parseInt(response) === challenge.expected;
};