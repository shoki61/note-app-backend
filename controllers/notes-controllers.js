const validator = require("validator");
const mongoose = require('mongoose');

const Note = require("../models/note");
const User = require('../models/user');
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
    const {title, description, keywords, image, visible, creator} = req.body;
    

    if(!title || !description){
        return res.status(400).json({message: errors.required});
    };

    let user;
    try{
        user = await User.findById(creator);
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
    if(!user){
        return res.status(404).json({message: errors.notFound('User')});
    };


    const note = new Note({
        title,
        description,
        image: image || '',
        keywords,
        visible,
        creator
    });
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await note.save({session: sess});
        user.notes.push(note);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch(e){
        return next(res.status(500).json({message: errors.unexpected}));
    };
    res.status(201).json({note});
};

const updateNote = async(req, res, next) => {
    const noteId = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if(!isValidOperation) {
        return res.status(400).json({message: 'Please enter an item you want to update.'});
    };
    try {
        let note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: errors.notFound('Note')});
        };
        updates.forEach(update => note[update] = req.body[update]);
        await note.save();
        res.status(200).json({note});
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
};

const deleteNote = async(req, res, next) => {
    const noteId = req.params.id;
    let note;
    try {
        note = await Note.findById(noteId).populate('creator');
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };

    if(!note) {
        return res.status(404).json({message: errors.notFound('Note')});
    };
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await note.remove({session: sess});
        note.creator.notes.pull(note);
        await note.creator.save({session: sess});
        await sess.commitTransaction();
    } catch(e) {
        return res.status(500).json({message: errors.unexpected});
    };
    res.status(200).json({deleted: note});
};


module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
