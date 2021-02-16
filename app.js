const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRouter = require('./routes/users-routes');

const app = express();


app.use(bodyParser.json());
app.use('/api',userRouter);



mongoose.connect().then(() => app.listen(5000)).catch(error => console.log(error));