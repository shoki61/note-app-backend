const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true
    },
    job: {
        type: String,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not a valid email");
            };
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    image: {
        type:String
    },
    notes: [{ 
        type: mongoose.Types.ObjectId, 
        required: true, 
        ref: 'Note'
    }],
    following: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    follower: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    links: {
        type: Object
    },
    markings: [{
        type: mongoose.Types.ObjectId,
        ref: 'Note'
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Note'
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Note'
    }]
},{timestamps: true});


const User = mongoose.model('User', userSchema);


module.exports = User;