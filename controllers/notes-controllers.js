const validator = require("validator");

const Note = require("../models/note");
const errors = require('../error-messages/messages');

const getNotes = async(req, res, next) => {
    let notes;
    try {
        notes = await Note.find({});
        if(!notes.length){
            return res.status(404).json({message: errors.notFound('Notes')});
        };
        res.status(200).json({notes});
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
};

const createNote = async(req, res, next) => {
    const {title, description, image} = req.body;

    if(!title || !description){
        return res.status(400).json({message: errors.required});
    };
    try {
        const note = new Note({
            title,
            description,
            image: image || ''
        });
        note.save();
        return res.status(201).json({note});
    } catch(e){
        return next(res.status(500).json({message: errors.unexpected}));
    };
};


module.exports = {
    getNotes,
    createNote
};
