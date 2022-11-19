const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();


app.listen(8800,() =>{
    console.log("Backend server is running!")
})