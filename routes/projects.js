const express = require('express');
const ProjectModel = require('../models/projects');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await ProjectModel.find();
  if(!projects) res.status(404).send('Nenhum projecto encontrado');

  res.send(projects);
});

router.post('/adicionar-projecto', async (req, res) => {
  let newProject = new ProjectModel({
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
  });

  try {
    newProject = await newProject.save();
    res.send(newProject);
  } catch(error) {
    console.log(error.message);
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const project = await ProjectModel.findByIdAndUpdate(id, {
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
    }, { new: true });

    res.send(project);

  } catch(error) {
    console.log(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  const project = await ProjectModel.findById(id);
  if(!project) res.status(404).send('Este projecto não existe.');

  try {
    const deletedProject = await ProjectModel.findByIdAndDelete(id);
    res.send(deletedProject);

  } catch(error) {
    console.log(error.message);
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const project = await ProjectModel.findById(id);
    res.send(project);
    
  } catch(error) {
    console.log(error.message);
  }
});

/*
async function addProject() {
  let newProject = new ProjectModel({
    domain: 'devsoft.co.ao',
    status: 'Pendent',
    category: 'Website',
    hostingProvider: 'Godaddy',
    domainProvider: 'SEPE',
    domainExpirationDate: '2018-01-24T21:42:47.912Z',
    percentageConclusion: 50,
    wpUser: 'admin',
    wpPassword: 'admin123',
    startDate: '2015-02-30T21:42:47.912Z',
    conlusionDate: '2016-02-24T21:42:47.912Z',
    lastBackupDate: '2020-11-24T21:42:47.912Z',
    "clientInformation": {
      "clientName": "Devsoft",
      "clientPhone": "934546534",
      "clientEmail": "geral@devsoft.co.ao",
    },
    observation: 'Alguma observação para este projecto.',
  });

  newProject = await newProject.save();
  console.log(newProject);
}

addProject();

*/

module.exports = router;