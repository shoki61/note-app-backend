const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users-routes');
const notesRouter = require('./routes/notes-routes');

const app = express();


app.use(bodyParser.json());
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



mongoose.connect('mongodb+srv://shoki:murtishoki61@cluster0.sbiw4.mongodb.net/mern?retryWrites=true&w=majority')
    .then(() => app.listen(5000))
    .catch(error => console.log(error));