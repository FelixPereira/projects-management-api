const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find('-conlusionDate');
  if(!projects) {
    res.status(404).send('Nenhum projecto encontrado.');
  } else {
      res.send(projects);
    }
});

router.post('/adicionar-projecto', async (req, res) => {
  const {error} = validate(req.body);
  if(error) {
    res.status(400).send(error.details[0].message);
  } else {
      const responsible = await User.findById(req.body.responsibleId);

      if(!responsible) {
        res.send('O usuário selecionado não existe.');
      } else {
          let newProject = new Project({
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
          });
        
          try {
            newProject = await newProject.save();
            res.send(newProject);
          } 
          catch(error) {
            console.log(error.message);
          }
        }
      }
});

router.put('/:id', async (req, res) => {
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
    
        project = project.save();
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