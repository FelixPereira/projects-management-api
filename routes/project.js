const express = require('express');
const router = express.Router();
const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const {verifyAuthAndAdmin, verifyAuth} = require('../middleware/verifyAuth');

router.get('/', verifyAuthAndAdmin, async (req, res) => {
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
      telephone: responsible.telephone
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
  console.log(responsible._id)
  console.log(req.user);

  if(responsible._id !== req.user.id && req.user.isAdmin === false) return res.status(403).send('Você não tem permissão para fazer esta alteração.'); 
  
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        ...req.body,
        responsible: {
          name: responsible.name,
          email: responsible.email,
          telephone: responsible.telephone
        }
      }
    }, {new: true});
    res.send(project);
  } catch(err) {
    res.status(500).send('err:', err.message);
  }

  
});

router.delete('/:id', verifyAuthAndAdmin, async (req, res) => {
  const id = req.params.id;

  const project = await Project.findById(id);
  if(!project) {
    res.status(404).send('Este projecto não existe.');
  } else {
      try {
        const deletedProject = await Project.findByIdAndDelete(id);
        res.send(deletedProject);
    
      } 
      catch(error) {
        console.log(error.message);
      }
    }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const project = await Project.findById(id);
    res.send(project);
    
  } catch(error) {
    console.log(error.message);
  }
});

module.exports = router;