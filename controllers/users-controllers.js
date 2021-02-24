const validator = require("validator");
const bcrypt = require('bcryptjs');

const User = require("../models/user");
const errors = require('../error-messages/messages');


const signUp = async (req, res, next) => {
  const { name, email, password, job } = req.body;
  if (!validator.isEmail(email) || !validator.isLength(password, { min: 8 })) {
    return res.json({ message: errors.invalid });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch(e){
    return res.status(500).json({message:'Coult not create user, please try again.'});
  };

  const user = new User({
    name,
    email,
    password: hashedPassword,
    job: job || "",
    notes: [],
    likes: [],
    markings: [],
    image: '',
    following: [],
    follower: [],
    links:[],
    comments:[]
  });
  try {
    await user.save();
    res.status(201).json({ user });
  } catch (e) {
    return res.json({ message: errors.unexpected });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    return res.json({ message: "Please enter valid email" });
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (e) {
    return res
      .status(500)
      .json({ message: errors.verification });
  }
  if (!user) {
    return res
      .status(401)
      .json({ message: "No user registered to this email, please sign up." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch(e){
    return res.status.json({message:'Coult not log you in, please check your credentials and try egain.'});
  };
  if(!isValidPassword){
    return res.status(401).json({message:'Invalid credentials, could not log you in'});
  };

  res.status(200).json({ user });
};

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
    if (!users.length) {
      return res.status(500).json({ message: errors.notFound('Users') });
    }
    res.status(200).json({ users });
  } catch (e) {
    return res
      .status(500)
      .json({ message: errors.unexpected });
  }
};

const getUser = async(req, res, next) => {
    const userId = req.params.id;

    let user;
    try {
        user = await User.findById(userId);
        res.json(user);
    }catch(e) {
        return res.status(500).json({message: errors.notFound('User')});
    };
};

const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "job"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({message:'Please enter an item you want to update'});
  };

  try {
    let user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message: errors.notFound('User')});
    };
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.status(200).json({user});
  } catch (e) {
    return res.status(500).json({message: errors.unexpected});
  };
};

const deleteUser = async(req, res, next) => {
    const userId = req.params.id;

    let user;
    try {
        user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: errors.notFound('User')});
        };
        user.remove();
        res.json({deleted:user});
    } catch(e) {
        return res.status().json({message: errors.unexpected});
    };
};


module.exports = {
  signUp,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
