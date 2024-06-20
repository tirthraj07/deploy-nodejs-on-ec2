const express = require('express')
require('dotenv').config()
const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res)=>{
    res.status(200).send('<h1>Deploying a Node JS Application on EC2</h1>');
})

app.listen(PORT, ()=>{
    console.log(`Server listening at ${PORT}`);
})