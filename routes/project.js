const express = require('express');
const router = express.Router();
const {Project, validate} = require('../models/project');
const {User} = require('../models/user');
const {verifyAuthAndAdmin, verifyAuth} = require('../middleware/verifyAuth');
const {
  getProjects,
  getProject,
  addProject,
  deleteProject,
  updateProject
} = require('../controllers/projects');

router.get('/', getProjects);
router.post('/adicionar-projecto', addProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.get('/:id', getProject);

module.exports = router;