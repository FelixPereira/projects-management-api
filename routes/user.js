const express = require('express');
const router = express.Router();
const {verifyAuthAndAdmin, verifyAuthAndAuthorization} = require('../middleware/verifyAuth');
const {
  getUsers,
  addNewUser,
  updateUser,
  deleteUser,
  getUser,
  assignProject,
  userLogin,
  validateToken
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/adicionar-usuario', addNewUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getUser);
router.post('/adicionar-project-user', assignProject);
router.post('/login', userLogin);
router.post('/validar-token', validateToken);

module.exports = router;