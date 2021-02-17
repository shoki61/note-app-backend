const express = require('express');

const contollers = require('../controllers/users-controllers');

const router = express.Router();


router.post('/signup', contollers.signUp);

router.post('/login', contollers.login);

router.get('/users', contollers.getUsers);

router.get('/user/:id', contollers.getUser);

router.patch('/update-user/:id', contollers.updateUser);

router.delete('/delete-user/:id', contollers.deleteUser); 


module.exports = router;