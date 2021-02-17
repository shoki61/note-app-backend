const express = require('express');

const contollers = require('../controllers/users-controllers');

const router = express.Router();


router.get('/users', contollers.getUsers);

router.post('/signup', contollers.signUp);

router.post('/login', contollers.login);

module.exports = router;