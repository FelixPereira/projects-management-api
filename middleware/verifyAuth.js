const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

function verifyAuth(req, res, next) {
  const token = req.header('x-token');
  if(!token) return res.status(401).send('Você deve fazer login.');

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch(err) {
    res.status(400).send('Token inválido.');
  }
};

function verifyAuthAndAdmin(req, res, next) {
  verifyAuth(req, res, () => {
    if(req.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Precisa de um nível de permissão maior.');
    }
  });
};

function verifyAuthAndAuthorization(req, res, next) {
  verifyAuth(req, res, () => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Não está autorizado a realizar esta operação.');
    }
  });
};

module.exports = {verifyAuth, verifyAuthAndAdmin, verifyAuthAndAuthorization};