const express = require('express');

const contollers = require('../controllers/notes-controllers');

const router = express.Router();


router.get('/', contollers.getNotes);

router.post('/create-note', contollers.createNote);

router.patch('/update-note/:id', contollers.updateNote);

router.delete('/delete-note/:id', contollers.deleteNote);

router.delete('/delete-all-notes', contollers.deleteAllNotes);

module.exports = router;