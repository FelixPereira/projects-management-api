const express = require('express');
const router = express.Router();
const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const {verifyAuthAndAdmin, verifyAuth} = require('../middleware/verifyAuth');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort('startDate');
    if(!projects) return res.status(400).send('Nenhum projecto encontrado.');
  
    res.send(projects);
  } catch(err) {
    res.status(500).send(err);
  }
});

router.post('/adicionar-projecto', verifyAuthAndAdmin, async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const responsible = await User.findById(req.body.responsibleId);

  let newProject = new Project({
    ...req.body,
    responsible: {
      name: responsible.name,
      email: responsible.email,
      telephone: responsible.telephone,
      _id: responsible._id
    }
  });
        
  try {
    await newProject.save();
    responsible.projects.push(newProject);
    await responsible.save();
    res.send(newProject);
  } 
  catch(error) {
    console.log(error.message);
  }
});

router.put('/:id', verifyAuth, async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const responsible = await User.findById(req.body.responsibleId);
  const currentUser = req.user;
  if(
    responsible._id !== currentUser.id
    && !currentUser.isAdmin
  ) return res.status(403).send('Você não tem permissão para fazer esta alteração.'); 
  
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
        responsible: {
          name: responsible.name,
          email: responsible.email,
          telephone: responsible.telephone,
          _id: responsible._id
        }
      }
    }, {new: true});

    res.send(project);

  } catch(err) {
    res.status(500).send('err:', err.message);
  }
});

router.delete('/:id', verifyAuth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  const currentUser = await User.findById(req.user);

  if(
    currentUser.id !== project.responsible._id
    && !currentUser.isAdmin
  ) return res.status(403).send('Não tem permissão para efectuar esta operação...');

  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    res.send(deletedProject);
  } 
  catch(error) {
    console.log(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.send(project);
    
  } catch(error) {
    console.log(error.message);
  }
});

module.exports = router;