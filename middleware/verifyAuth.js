const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

function verifyAuth(req, res, next) {
  const token = req.header.token;
  if(!token) return res.status(401).send('Você deve fazer login.');

  const isValid = jwt.verify(token, JWT_SECRET);
  if(isValid) {
    next();
  } else {
    res.status(400).send('O seu token é inválido.');
  }
};

function verifyAuthAndAdmin(req, res, next) {
  verifyAuth(req, res, () => {
    if(req.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Precisa de um nível de permissão maior.')
    }
  });
};

module.exports = {verifyAuth, verifyAuthAndAdmin};