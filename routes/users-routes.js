const express = require('express');

const contollers = require('../controllers/users-controllers');

const router = express.Router();


router.get('/users', (req, res) =>{
    res.send({users:45})
});

router.post('/signup', (req, res) => {
    console.log(req.body);
});

router.post('/login', contollers.login);

module.exports = router;