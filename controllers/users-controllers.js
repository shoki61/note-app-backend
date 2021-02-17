const validator = require('validator');

const User = require('../models/user');


const signUp = async (req, res, next) => {
    const {name, email, password, job} = req.body;
    if(!validator.isEmail(email) || !validator.isLength(password,{min:8})){
        return res.json({message:'invalid value'});
    }
    const user = new User({
        name,
        email,
        password,
        job: job || ''
    });
    try{
        await user.save();
        res.status(201).json({user});
    }catch(e) {
        return res.json({error:e});
    };
};

const login = async (req, res, next) => {
    const { email, password} = req.body;
    if(!validator.isEmail(email)){
        return res.json({message:'Please enter valid email'});
    }
    res.json({user: req.body});
};

exports.login = login;
exports.signUp = signUp;