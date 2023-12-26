const port = 3000;
const express = require('express');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.listen(port, () => console.log(`Server listening a port ${port}!`))

console.log("Server running... fully!")




