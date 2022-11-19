const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});