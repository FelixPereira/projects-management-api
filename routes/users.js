const UserModel = require('../models/users'); 
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await UserModel.find().sort('name');
  if(!users || users.length === 0) res.status(404).send('Nenhum usuário encontrado');
  res.send(users);
});

router.post('/adicionar-usuario', async (req, res) => {
  let newUser = await new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });

  try {
    newUser = await newUser.save();
    res.send(newUser);
  } catch(error) {
      console.log(error.message);
    }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findById(id);
  if(!user) res.status(404).send('Este usuário não existe');

  try {
    user = await UserModel.findByIdAndUpdate(id, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
    }, { new: true });

    res.send(user);

  } catch(error) {
      console.log(error.message);
    }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  let user = await UserModel.findById(id);
  if(!user) res.status(404).send('Este usuário não existe');

  try {
    user = await UserModel.findByIdAndRemove(id);
    res.send(user);
  } catch(error) {
      console.log(error.message);
    }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findById(id);
  if(!user) res.status(404).send('Este usuário não existe');

  try {
    req.send(user);
  } catch(error) {
    console.log(error.message);
    }
});

module.exports = router;