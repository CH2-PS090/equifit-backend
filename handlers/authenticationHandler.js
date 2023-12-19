const jwt = require('jsonwebtoken');

const secretKey = 'equifit';

function generateToken(userId, email) {
  return jwt.sign({ userId, email }, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

function getTokenData(token) {
  const tokenParts = token.split(' ');
  if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer') {
    const token = tokenParts[1];
    // Verify the token
    const decodedToken = verifyToken(token);

    // Check if the token is valid
    if (decodedToken) {
      const { userId, email } = decodedToken;
      return { userId, email };
    }
  }
  return null;
}

module.exports = { generateToken, getTokenData };
