const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');

env.config();

router.post('/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Email ou password inválidos');

  const passwordIsEqual = await bcrypt.compare(req.body.password, user.password);
  if(!passwordIsEqual) return res.status(400).send('Email ou passord inválido.');

  const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
  res.status(200).send({
    ...user,
    token
  });
});

module.exports = router;