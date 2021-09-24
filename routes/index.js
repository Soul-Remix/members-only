const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

/* GET home page. */
router.get('/', controller.index);

// Sign Up

router.get('/sign-up', controller.signup_get);

router.post('/sign-up', controller.signup_post);

// Login

router.get('/login', controller.login_get);

router.post('/login', controller.login_post);

// Login Error

router.get('/login-error', controller.loginError);

// Logout

router.get('/log-out', controller.logout);

module.exports = router;
