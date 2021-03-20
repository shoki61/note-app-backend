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
    comments: [{
        user:{
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        },
        image: {
            type: String
        },
        comment: {
            type: String
        },
        date: {
            type: String
        }
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    markings: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
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