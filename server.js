const express = require('express')
require('dotenv').config()
const app = express();

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.get('/', (req, res)=>{
    res.status(200).send('<h1>Deploying a Node JS Application on EC2</h1>');
})

app.listen(PORT,HOSTNAME, ()=>{
    console.log(`Server listening at http://${HOSTNAME}:${PORT}`);
})