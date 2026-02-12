/**
 * User Routes
 * Registration, login, logout, and session info.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/register', controller.registerPage);
router.post('/register', controller.register);

router.get('/login', controller.loginPage);
router.post('/login', controller.login);

router.get('/logout', controller.logout);

router.get('/me', controller.me);

module.exports = router;
