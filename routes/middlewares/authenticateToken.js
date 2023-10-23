const jwt = require('jsonwebtoken');
const activeTokens = require('../../tokenManager');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization; // Get the token from the request header

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.jwtsecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    if (activeTokens.has(token)) {
      req.user = user; // Make the user information available in the request for future use
      next(); // Continue to the next middleware or route
    } else {
      res.send("Token Expired")
    }


  });
}

module.exports = authenticateToken;
