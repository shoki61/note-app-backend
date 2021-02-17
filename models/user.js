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
    }
},{timestamps: true});


const User = mongoose.model('User', userSchema);


module.exports = User;