const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users-routes');
const notesRouter = require('./routes/notes-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
    next();
});


app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);

app.use((req, res, next) => {
    const error = new Error('Coult not find this routes');
    throw res.status(404).json({error});
});

app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, error => console.log(error));
    };
    if(res.headerSent){
        return next(error);
    };
    res.status(error.code || 500).json({message: error.message || 'An unknown error occurred'});
});


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sbiw4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => app.listen(5000))
    .catch(error => console.log(error));