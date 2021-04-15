const mongoose = require('mongoose');

const Note = require("../models/note");
const User = require('../models/user');
const errors = require('../error-messages/messages');

const getNotesByUserId = async(req, res, next) => {
    
    const userId = req.params.id;
    let userNotes;
    try {
        userNotes = await User.findById(userId).populate('notes');
    } catch(e){
        return res.status(5000).json({message: errors.unexpected});
    };

    res.status(200).json({notes: userNotes.notes});
};

const getNoteById = async(req, res, next) => {
    const noteId = req.params.id;

    let note;
    try {
        note = await Note.findById(noteId).populate('creator').populate('comments.user');
    } catch(e){
        return res.status().json({message: errors.unexpected});
    };
    if(!note){
        return res.status(401).json({message: errors.notFound('Note')});
    };
    res.status(200).json({note});
};

const getNotes = async(req, res, next) => {
    let notes;
    try {
        notes = await Note.find({}).populate('creator');
        if(!notes.length){
            return res.status(404).json({message: errors.notFound('Notes')});
        };
        res.status(200).json({notes});
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
};

const createNote = async(req, res, next) => {
    const {title, description, keywords, hidden, userId} = req.body;

    if(!title && !description){
        return res.status(400).json({message: errors.required});
    };

    let user;
    try{
        user = await User.findById(userId);
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
    if(!user){
        return res.status(404).json({message: errors.notFound('User')});
    };
    const arrKeywords = keywords ? keywords.split(',') : null;

    const note = new Note({
        title,
        description,
        image: req.file ? req.file.path : null,
        keywords: arrKeywords || [],
        hidden,
        markings: [],
        likes: [],
        comments:[],
        creator: userId
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
    const allowedUpdates = ["title", "description", "keywords", "likes", "markings", "comments", "comment", "image", "hidden", "userId"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));


    if(!isValidOperation) {
        return res.status(400).json({message: 'Please enter an item you want to update.'});
    };
    let note;
    try {
        note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: errors.notFound('Note')});
        };
    } catch(e){
        return res.status(500).json({message: errors.unexpected});
    };
    

    let user;
    try{
        user = await User.findById(req.body.userId);
    } catch(e){
        return res.status(401).json({message: errors.notFound('User')});
    };

    await updates.forEach( async update => {
        if(update === 'likes'){
            const userId = req.body.userId;
            if(note[update].indexOf(userId) > -1) return;
            note[update].push(userId);

            const sess = await mongoose.startSession();
            sess.startTransaction();
            await note.save({session: sess});
            user.likes.push(note);
            await user.save({session: sess});
            await sess.commitTransaction();

        }else if (update === 'markings'){
            const userId = req.body.userId;
            if(note[update].indexOf(userId) > -1) return;
            note[update].push(userId);

            const sess = await mongoose.startSession();
            sess.startTransaction();
            await note.save({session: sess});
            user.markings.push(note);
            await user.save({session: sess});
            await sess.commitTransaction();

        }else if(update === 'comments'){
            const user = await User.findById(req.body.userId);
            const { userId, comment } = req.body;
            if(!user) return;
            note[update].push({
                user: userId,
                name: user.name,
                image: user.image,
                comment: comment,
                date: new Date().toLocaleString()
            });

            const sess = await mongoose.startSession();
            sess.startTransaction();
            await note.save({session: sess});
            user.comments.push(note);
            await user.save({session: sess});
            await sess.commitTransaction();
            
        }else if(update === 'keywords'){
            const arrKeywords = req.body.keywords ? req.body.keywords.split(',') : [];
            note[update] = arrKeywords;
        }else if(update === 'image'){
            if(req.body[update] === 'null'){
                note[update] = null;
            }
        }else{
            note[update] = req.body[update];
        };
    });

    if(req.file && req.file.path){
        note.image = req.file.path;
    };
    if(updates.indexOf('likes') === -1 && updates.indexOf('markings') === -1 && updates.indexOf('comments') === -1){
        await note.save();
    };
    if(updates.indexOf('comments') > -1 && req.body.comment === '') return res.status(401).json({message:errors.required});
    res.status(200).json({note});
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
        note.creator.likes.pull(note);
        note.creator.markings.pull(note);
        note.creator.comments.pull(note);
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
    deleteNote,
    getNotesByUserId,
    getNoteById,
};
