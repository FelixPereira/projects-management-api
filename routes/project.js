const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find().sort('startDate');
  if(!projects) return res.status(400).send('Nenhum projecto encontrado.');

  res.send(projects);
});

router.post('/adicionar-projecto', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  let project = await Project.findById(id);
  if(!project) {
    res.status(404).send('Este projecto não existe');
  } else {
      try {
        project = {
          domain: req.body.domain,
          status: req.body.status,
          category: req.body.category,
          hostingProvider: req.body.hostingProvider,
          domainProvider: req.body.domainProvider,
          domainExpirationDate: req.body.domainExpirationDate,
          percentageConclusion: req.body.percentageConclusion,
          wpUser: req.body.wpUser,
          wpPassword: req.body.wpPassword,
          startDate: req.body.startDate,
          conlusionDate: req.body.conlusionDate,
          lastBackupDate: req.body.lastBackupDate,
          clientInformation: {
            clientName: req.body.clientInformation.clientName,
            clientPhone: req.body.clientInformation.clientPhone,
            clientEmail: req.body.clientInformation.clientEmail,
          },
          observation: req.body.observation,
          responsible: {
            name: responsible.name,
            email: responsible.email,
            telephone: responsible.telephone
          }
        };
    
        await project.save();
        res.send(project);
    
      } catch(error) {
        console.log(error.message);
      }
    }
});

router.delete('/:id', async (req, res) => {
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