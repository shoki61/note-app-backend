const mongoose = require('mongoose');


const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    commends: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    likes: {
        type: Number,
    },
    markings: {
        type: Number
    },
    keywords: [{
        type: String
    }],
    hidden: {
        type: Boolean,
        required: true
    }
},{timestamps: true});


const Note = mongoose.model('Note', noteSchema);


module.exports = Note;