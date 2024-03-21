// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');

const {JWT_Access_key, JWT_Access_Crypto_key} = require('../config')

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let decryptedtoken = cryptojs.AES.decrypt(token, JWT_Access_Crypto_key)
  decryptedtoken = decryptedtoken.toString(cryptojs.enc.Utf8);

  jwt.verify(decryptedtoken, JWT_Access_key, (error, decodedUser) => {
    if (error) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.user = decodedUser;
    next();
  });
}

module.exports = { authenticateToken };
