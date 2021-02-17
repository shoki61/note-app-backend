const express = require('express');

const contollers = require('../controllers/users-controllers');

const router = express.Router();


router.post('/signup', contollers.signUp);

router.post('/login', contollers.login);

router.get('/users', contollers.getUsers);

router.patch('/update-user/:id', contollers.updateUser)

module.exports = router;