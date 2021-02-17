const express = require('express');

const contollers = require('../controllers/notes-controllers');

const router = express.Router();


router.get('/', contollers.getNotes);



module.exports = router;