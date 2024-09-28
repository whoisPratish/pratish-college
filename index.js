const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = 5000;

app.use(cookieParser());
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static('docs'))
app.set('views', path.join(__dirname, 'docs')); // Set the views directory to docs


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

const userSchema = mongoose.Schema({
    username : String,
    password : String,
    role : String
})


const User = mongoose.model('User', userSchema);


const isTeacher = (req,res,next)=>{
    if(req.cookies.role === 'teacher'){
        next()
    } else{
        res.send('You must be a teacher to view this page.')
    }
}

const isAthenticated = (req,res,next)=>{
    if (req.cookies.auth === 'true'){
        next();
    }
    else {
        res.send('Please sign in to view the page')
    }
}

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/dashboard', isAthenticated, (req,res)=>{
    res.render('dashboard')
})

app.get('/contact',isAthenticated, (req,res)=>{
    res.render('contact')
})

app.get('/service', isAthenticated, (req,res)=>{
    res.render('service')
})

app.get('/teacher', isAthenticated, isTeacher, (req,res)=>{
    res.render('teacher')
})

app.post('/login', async (req,res)=>{
    const {username, password, role} = req.body;
     
    const existingUser = await User.findOne({username, password})
    if (existingUser){
        res.cookie('auth', 'true');
        res.cookie('role', existingUser.role);
        res.redirect('/dashboard')
    }
    else {
        res.send('Login credential error...')
    }

})

app.post('/register', async (req,res)=>{
    const {username, password, role} = req.body;

    const existingUser = await User.findOne({username});
    if (existingUser){
        res.send('Username already taken')
    }
    else {
        const newUser = new User({
            username,
            role,
            password
        })
        await newUser.save();
        res.cookie('auth', 'true');
        res.cookie('role', role);
        res.redirect('/dashboard')
    }
})

app.post('/logout', (req,res)=>{
    res.clearCookie('auth', 'true');
    res.clearCookie('role', role);
    res.redirect('/')
})

app.listen(port, ()=>{
    console.log(`Server is running in port ${port}`);
    
})