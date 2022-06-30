const UserModel = require('../models'); 
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await UserModel.find();
  if(!users) res.status(404).send('Nenhum usuário encontrado');
  res.send(users);
});

router.post('/adicionar-usuario', async (req, res) => {
  const newUser = await new UserModel({
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
    user = UserModel.findByIdAndUpdate(id, {
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
