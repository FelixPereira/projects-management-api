const express = require('express');
const router = express.Router();
const {verifyAuthAndAdmin, verifyAuthAndAuthorization} = require('../middleware/verifyAuth');
const {
  getUsers,
  addNewUser,
  uppdateUser,
  deleteUser,
  getUser,
  assignProject,
  userLogin
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/adicionar-usuario', addNewUser);
router.put('/:id', verifyAuthAndAuthorization, uppdateUser);
router.delete('/:id', verifyAuthAndAuthorization, deleteUser);
router.get('/:id', getUser);
router.post('/adicionar-project-user', verifyAuthAndAdmin, assignProject);
router.post('/login', userLogin);

module.exports = router;