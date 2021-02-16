const express = require('express');

const contollers = require('../controllers/users-controllers');

const router = express.Router();


router.get('/users', (req, res) =>{
    res.send({users:45})
});

router.post('/signup', contollers.signUp);

router.post('/login', contollers.login);

module.exports = router;