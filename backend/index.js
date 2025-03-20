require('dotenv').config();
const db = require('./database/database.js');
const express = require('express');
const router = require('./routes/index.js');

db.connect();

const app = express();

app.get('/api', router);

app.get('/',(req, res)=> {
    res.send("Hello World");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is up and running on port: ${PORT}`);
})