const express = require('express');

const contollers = require('../controllers/users-controllers');
const uploadImage = require('../middleware/uploadImage');

const router = express.Router();

  

router.post('/signup', contollers.signUp);

router.post('/login', contollers.login);

router.get('/', contollers.getUsers);

router.get('/user/:id', contollers.getUser);

router.patch('/update-user/:id', uploadImage.single('image'), contollers.updateUser);

router.delete('/delete-user/:id', contollers.deleteUser); 


module.exports = router;