const {Project, validate, validate2} = require('../models/project');
const {User} = require('../models/user');
const _ = require('lodash');

// GET PROJECTS
const getProjects = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    let projects = await Project.find();

    if(searchTerm) {
      projects = projects.filter(project => {
        return project.domain.includes(searchTerm) || 
          project.clientInformation.clientName.includes(searchTerm);
      });
    }

    if(!projects || projects.length === 0)
      return res.status(500).send('Nenhum projecto encontrado.');
  
    res.status(200).send(projects);
  } catch(err) {
    res.status(500).send(err);
  }
};

// ADD PROJECT
const addProject = async (req, res) => {
  // const {error} = validate(req.body);
  // if(error) return res.status(400).send(error.details[0].message);
  // const error = validate(req.body);
  // if(error) return res.status(400).send(error);

  try {
    const responsible = await User.findById(req.body.responsibleId);
    if(!responsible) return res.status(404).send('O usuário não foi encontrado.');

    console.log(responsible);
    const project = _.omit(
      req.body, [
      'clientName', 
      'clientEmail', 
      'clientTelephone', 
      'responsibleId'
    ]);

    const newProject = new Project({
      ...project,
      clientInformation: {
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        clientTelephone: req.body.clientTelephone
      },
      responsible: {
        name: responsible.name,
        email: responsible.email,
        telephone: responsible.telephone,
        _id: responsible._id
      }
    });

    await newProject.save();
    responsible.projects.push(newProject);
    await responsible.save();
    res.status(200).send('Project adicionado com sucesso.');
  } catch(err) {
    res.status(500).send(err.message);
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    // const {error} = validate(req.body);
    // if(error) return res.status(400).send(error.details[0].message);
  
    const responsible = await User.findById(req.body.responsibleId);
    // const currentUser = req.user;
    // if(
    //   responsible._id !== currentUser.id
    //   && !currentUser.isAdmin
    // ) return res.status(403).send('Você não tem permissão para fazer esta alteração.'); 


    const project = _.omit(
      req.body, 
      [
        'clientName', 
        'clientEmail', 
        'clientTelephone',
        'responsibleId'
      ]
    );

    await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        ...project,
        clientInformation: {
          clientName: req.body.clientName,
          clientEmail: req.body.clientEmail,
          clientTelephone: req.body.clientTelephone,
        },
        responsible: {
          name: responsible.name,
          email: responsible.email,
          telephone: responsible.telephone,
          _id: responsible._id
        }
      }
    }, {new: true});

    res.status(200).send({message: 'Projecto actualizado com sucesso.'});

  } catch(err) {
    res.status(500).send(err.message);
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  // const currentUser = await User.findById(req.user.id);

  if(!project) return res.status(404).send('Projecto não encontrado.');

  // if(
  //   currentUser.email !== project.responsible.email
  //   && !currentUser.isAdmin
  // ) return res.status(403).send('Não tem permissão para efectuar esta operação...');

  try {
    await Project.findByIdAndDelete(project._id);
    res.status(200).send('Removido com sucesso.');
  } catch(err) {
    res.status(500).send(err.message);
  }
};

// GET SINGLE PROJETCT
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).send('Projecto não encontrado');

    res.status(200).send(project);
    
  } catch(err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getProject
};