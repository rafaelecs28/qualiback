const express = require('express')
const User = require('../models/Usuario')
const auth = require('../middleware/auth')
const UserController = require('../controllers/UsuariosController');
const LoginController = require('../controllers/LoginController');

const router = express.Router()

router.post('/users', auth, UserController.criarUsuario);

router.post('/users/login', LoginController.login);

/*router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})*/

router.post('/users/me/logout', auth, LoginController.logout);

router.post('/users/me/logoutall', auth, LoginController.logoutAll);

router.get('/', UserController.index);

router.put('/users/update', auth, UserController.updateUser);

router.delete('/users/delete/:cpf', auth, UserController.deleteUser);

router.get('/usuarios/:role', auth, UserController.usuarios);

module.exports = router
