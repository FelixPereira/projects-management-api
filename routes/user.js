const {User, validate} = require('../models/user'); 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {Project} = require('../models/project');
const {verifyAuthAndAdmin, verifyAuthAndAuthorization} = require('../middleware/verifyAuth');

router.get('/', verifyAuthAndAdmin, async (req, res) => {
  try {
    const users = await User.find().sort('name');
    if(!users || users.length === 0) return res.status(400).send('Nenhum usuário encontrado.');

    res.send(users);
  }
  catch(error) {
    console.log(error);
  }
});

router.post('/adicionar-usuario', verifyAuthAndAdmin, async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('Este email já está em uso.');

  let newUser = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(req.body.password, salt);

  try {
    await newUser.save();
    res.send(newUser);
  } 
  catch(error) {
    console.log(error.message);
  }
});

router.put('/:id', verifyAuthAndAuthorization, async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  const existingUser = await User.findOne({email: req.body.email});
  let userToUpdate = await User.findById(id);

  if(existingUser && req.body.email !== userToUpdate.email) return res.send('Este email já está em uso');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    userToUpdate = await User.findByIdAndUpdate(id, {
      $set: {...req.body, password: hashedPassword}
    }, {new: true});

    res.send(userToUpdate);
  } 
  catch(error) {
    console.log(error.message);
  } 
});

router.delete('/:id', verifyAuthAndAuthorization, async (req, res) => {
  const id = req.params.id;

  try {
    const userToDelete = await User.findByIdAndRemove(id);
    res.send(userToDelete);
  } 
  catch(error) {
    console.log(error.message);
  }
});

router.get('/:id', verifyAuthAndAuthorization, async (req, res) => {
  const id = req.params.id;
  
  try {
    const user = await User.findById(id);
    res.send(user);
  } 
  catch(error) {
    console.log(error.message);
  }
});

router.post('/adicionar-project-user', verifyAuthAndAdmin, async (req, res) => {
  const user = await User.findById(req.body.userId);
  const project = await Project.findById(req.body.projectId);

  user.projects.push(project);

  try{j
    await user.save();
    res.send(user);
  }
  catch(error) {
    console.log(error.message);
  }
});

module.exports = router;