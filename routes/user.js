const {User, validate} = require('../models/user'); 
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  if(!users || users.length === 0) {
    res.status(400).send('Nenhum usuário encontrado.');
  } else {
      res.send(users);
    }
});

router.post('/adicionar-usuario', async (req, res) => {
  const {error} = validate(req.body);

  if(error) {
    res.status(400).send(error.details[0].message);
  } else {
      const user = await User.findOne({email: req.body.email});
      if(user) res.status(400).send('Este email já está em uso');

      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      try {
        newUser = await newUser.save();
        res.send(newUser);
      } 
      catch(error) {
        console.log(error.message);
      }
    }  
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);

  if(error) { 
    res.status(400).send(error.details[0].message);
  } else {
      const id = req.params.id;
      let userToUpdate = await User.findById(id);
      const registeredUser = await User.findOne({email: req.body.email});
    
      if(!userToUpdate) {
        res.status(404).send('Este usuário não existe');
      } else if(registeredUser) {
          res.send('Este email já está em uso');
        }
    
      userToUpdate = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      };
    
      try {
        userToUpdate = await userToUpdate.save();
        res.send(userToUpdate);
      } 
      catch(error) {
        console.log(error.message);
      }
    }  
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  let user = await User.findById(id);
  if(!user) {
    res.status(404).send('Este usuário não existe.');
  } else {
      try {
        user = await User.deleteOne({_id: id});
        res.send(user);
      } 
      catch(error) {
        console.log(error.message);
      }
    }

});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if(!user) {
    res.status(404).send('Este usuário não existe.');
  } else {
      try {
        res.send(user);
      } 
      catch(error) {
        console.log(error.message);
      }
    }
});

module.exports = router;