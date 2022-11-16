const jwt = require('jsonwebtoken');
const secret = 'gym-training-app-v1';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInNjb3BlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NjQyMTA2MzB9.CRXP-naOcoEzlvDCMuWAW94fxAa-ceUJacjF9ZyhVKY';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);
