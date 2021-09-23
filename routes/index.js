const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');

/* GET home page. */
router.get('/', controller.index);

// Sign Up

router.get('/sign-up', controller.signup_get);

router.post('/sign-up', controller.signup_post);

module.exports = router;
