const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users-routes');
const app = express();

app.use(bodyParser.json());

app.use('/api',userRouter);

app.listen(3000, () => {
    console.log('Works 3000 port...');
});