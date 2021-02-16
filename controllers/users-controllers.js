const validator = require('validator');


const signUp = async (req, res, next) => {
    const {name, email, password} = req.body;
    if(!validator.isEmail(email) || !validator.isLength(password,{min:8})){
        return res.json({message:'invalid value'});
    }
    res.json({user: req.body});
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