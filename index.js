const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = 5000;

const uri = 'mongodb://localhost:27017/my-database';

const connectToDb = async ()=>{
    try {
        await mongoose.connect(uri);
        console.log('Connected to Database');
        
    } catch (error) {
        console.error(error);
        
    }
}
connectToDb();

