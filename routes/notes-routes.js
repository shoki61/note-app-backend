const express = require('express');

const contollers = require('../controllers/notes-controllers');
const uploadImage = require('../middleware/uploadImage');

const router = express.Router();


router.get('/', contollers.getNotes);

router.get('/note/:id', )

router.get('/user-notes/:id', contollers.getNotesByUserId);

router.get('/note/:id', contollers.getNoteById);

router.post('/create-note', uploadImage.single('image'), contollers.createNote);

router.patch('/update-note/:id', uploadImage.single('image'), contollers.updateNote);

router.delete('/delete-note/:id', contollers.deleteNote);


module.exports = router;