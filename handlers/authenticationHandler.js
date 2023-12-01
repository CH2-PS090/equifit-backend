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

module.exports = { generateToken, verifyToken };
