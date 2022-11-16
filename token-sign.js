const jwt = require('jsonwebtoken');
const { config } = require('./config/config')

function signToken(user, secret = config.jwtSecret) {
  const payload = {
    sub: user.id,
    role: user.role
  };
  return jwt.sign(payload, secret);
}

// const token = signToken(payload, secret);
// console.log(token);
module.exports = signToken;

