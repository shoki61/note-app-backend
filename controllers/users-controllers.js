const validator = require('validator');

const User = require('../models/user');


const getUsers = async(req, res, next) => {
    let users;
    try{
        users = await User.find({});
        if(!users.length) {
            return res.status(500).json({message:'No user found'});
        };
        res.status(200).json({users});
    } catch(e) {
        return res.status(500).json({message:'Unexpected error please try again'});
    };
};

const signUp = async(req, res, next) => {
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

const login = async(req, res, next) => {
    const { email, password} = req.body;
    if(!validator.isEmail(email)){
        return res.json({message:'Please enter valid email'});
    }
    let user;
    try {
        user = await User.findOne({email});
    } catch(e) {
        return res.status(500).json({message:'Loging in failed, please try again later.'});
    };

    if(!user){
        return res.status(401).json({message:'No user registered to this email, please sign up.'});
    };

    if(user.password !== password){
        return res.status(401).json({message:'Your password is incorrect, please try again.'});
    }
    res.json({user});
};

exports.login = login;
exports.signUp = signUp;
exports.getUsers = getUsers;