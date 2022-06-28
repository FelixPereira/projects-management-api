const express = require('express');
const projectModel = require('../models/projects');
const router = express.Router();

router.get('/', async (req, res) => {
  const projects = projectModel.find();
  if(!projects) res.status(404).send('Nenhum projecto encontrado');

  res.send();
});

router.post('/addproject', async (req, res) => {
  let newProject = new projectModel({
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
      clientName: req.body.clientName,
      clientPhone: req.body.clientPhone,
      clientEmail: req.body.clientEmail,
    },
    observation: req.body.observation,
  });

  newProject = await newProject.save();
  res.send(newProject);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const project = await projectModel.findByIdAndUpdate(id, {
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
      clientName: req.body.clientName,
      clientPhone: req.body.clientPhone,
      clientEmail: req.body.clientEmail,
    },
    observation: req.body.observation,
  }, { new: true });

  res.send(project);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedProject = await projectModel.findByIdAndRemove(id);
  res.send(deletedProject);
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const project = await projectModel.findById(id);
  res.send(project);
});