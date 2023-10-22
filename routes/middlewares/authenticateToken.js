const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization; // Get the token from the request header

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.jwtsecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user; // Make the user information available in the request for future use
    next(); // Continue to the next middleware or route
  });
}

module.exports = authenticateToken;
