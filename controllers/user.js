const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const {User, validate} = require('../models/user'); 
const {Project} = require('../models/project');


env.config();

// ENCRYPT PASSWORD
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// USER LOGIN
const userLogin = async (req, res) => {
  if(!req.body.email || !req.body.password) return res.status(400).send('Email e password são obrigatórios');
  
  try {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email ou password inválido.');

    // const passwordIsEqual = await bcrypt.compare(req.body.password, user.password);
    // if(!passwordIsEqual) return res.status(400).send('Email ou password inválido.');

    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
    const { _id, name, email, telephone, avatar, projects, role, isAdmin } = user;
    
    res.status(200).send({ 
      user: {
        _id, 
        name, 
        email, 
        telephone, 
        avatar, 
        projects, 
        role, 
        isAdmin 
      },
      token
    });
  } catch(err) {
    res.staus(500).send(err.message);
  }
};

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort('name');
    if(!users || users.length === 0) return res.status(400).send('Nenhum usuário encontrado.');

    res.status(200).send(users);
  } catch(err) {
    send.status(500).send(err.message);
  }
};

// REGISTER NEW USER
const addNewUser = async (req, res) => {
  try {
  // const {error} = validate(req.body);
  // if(error) {
  //   res.status(400);
  //   throw new Error(error.details[0].message);
  // }

  const user = await User.findOne({email: req.body.email});
  if(user) return res.status(500).send('Este email já está registado.');

  let newUser = new User(req.body);
  newUser.password = await encryptPassword(req.body.password);

  await newUser.save();
  res.status(200).send('Usuário adicionado com sucesso.');
  } catch(err) {
    res.status(500).send(err.message);
  }
};

// UPDATE USER 
const uppdateUser = async (req, res) => {
  const {error} = validate(req.body);
  if(error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const id = req.params.id;

  const registeredUser = await User.findOne({email: req.body.email});
  let userToUpdate = await User.findById(id);

  if(registeredUser && req.body.email !== userToUpdate.email) {
    res.status(400);
    throw new Error('Este email já está em uso');
  }

  const hashedPassword = encryptPassword(req.body.password);

  try {
    userToUpdate = await User.findByIdAndUpdate(id, {
      $set: {...req.body, password: hashedPassword}
    }, {new: true});

    res.send(userToUpdate);
  } 
  catch(error) {
    console.log(error.message);
  } 
};

// DELETE USER
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const userToDelete = await User.findByIdAndRemove(id);
    res.send(userToDelete);
  } 
  catch(error) {
    console.log(error.message);
  }
};

// GET USER
const getUser = async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);

    if(!user) return res.status(500).send('Houve um erro. Tente novamente.');

    const {
       _id, 
       name, 
       email, 
       telephone, 
       avatar, 
       projects, 
       role, 
       isAdmin 
    } = user;

    res.status(200).send({
      _id, 
      name, 
      email, 
      telephone, 
      avatar, 
      projects, 
      role,
      isAdmin 
    });
  } catch(err) {
    res.status(500).send(err.message);
  }
};

// ASSIGN PROJECT TO USER
const assignProject = async (req, res) => {
  const user = await User.findById(req.body.userId);
  const project = await Project.findById(req.body.projectId);

  user.projects.push(project);

  try{
    await user.save();
    res.staus(400).send(user);
  }
  catch(error) {
    console.log(error.message);
  }
};

const validateToken = async (req, res) => {
  try {
    const token = req.body.token;

    const user = jwt.verify(token, process.env.JWT_SECRET);

    const user2 = await User.findById(user.id)

    res.status(200).send(user2);
  } catch(err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getUsers,
  addNewUser,
  uppdateUser,
  deleteUser,
  getUser,
  assignProject,
  userLogin,
  validateToken
};