//Solve mongoose.startSession() repeat

const validator = require("validator");
const bcrypt = require('bcryptjs');

const User = require("../models/user");
const errors = require('../error-messages/messages');
const Note = require("../models/note");


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
    user = await User.findOne({ email }).populate('markings').populate('likes').populate('comments');
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
        user = await User.findById(userId)
          .populate('notes')
          .populate('follower')
          .populate('following')
          .populate('markings')
          .populate('likes')
          .populate('comments');
        res.json(user);
    }catch(e) {
        return res.status(500).json({message: errors.notFound('User')});
    };
};




const updateUser = async (req, res, next) => {
  const userId = req.params.id;


  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "image", "email", "password", "job", "follow", ];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({message:'Please enter an item you want to update'});
  };
  

  try {
    let user = await User.findById(userId);
    if(!user){
        return res.status(404).json({message: errors.notFound('User')});
    };
    
    let followUser;
    if(req.body.follow){
      followUser = await User.findById(req.body.follow);
      if(!followUser) return res.status(401).json({message: errors.notFound('User')});
    };
    updates.forEach(async update => {
      if(update === 'follow'){
        if(!followUser.follower.includes(userId)){
          user.following.push(req.body.follow);
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await user.save({session: sess});
          followUser.follower.push(user);
          await followUser.save({session: sess});
          await sess.commitTransaction();
        }else {
          const newFollowings = user.following.filter(item => item.toString() !== req.body.follow );
          const newFollowers = followUser.follower.filter(item => item.toString() !== user._id.toString());
          user.following = newFollowings;
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await user.save({session: sess});
          followUser.follower = newFollowers;
          await followUser.save({session: sess});
          await sess.commitTransaction();
        }
      }
      else{
        user[update] = req.body[update]
      }
    });
    if(req.file.path){
      user.image = req.file.path
    };
    try{
      await user.save();
    }catch(e){
      console.log(e);
    };
    res.status(200).json({user});
  } catch (e) {
    return res.status(500).json({message: errors.unexpected});
  };
};

const deleteUser = async(req, res, next) => {
    const userId = req.params.id;

    let user;
    try {
        user = await User.findById(userId).populate('following');
        if(!user){
          return res.status(404).json({message: errors.notFound('User')});
        };
        await Note.deleteMany({creator: user._id});
        await user.remove();
        res.status(200).json({deleted:user});
    } catch(e) {
        return res.status(500).json({message: errors.unexpected});
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
