const { response } = require('express');
const User=require('../models/user');
const jwt=require('jsonwebtoken');

const handleErrors_login=(e)=>{
    console.log(e.message,e.code);
    let errors={ email: '', password: ''};
    if(e.message==='User not found!'){
        errors.email='User not found!';
    }
    if(e.message==='Incorrect password for the given email id :('){
        errors.password='Incorrect password for the given email id :(';
    }
}
const handleErrors =(e)=>{
    console.log(e.message,e.code);
    let errors={ email: '', password: '',username: ''};
    if(e.message==='User not found!'){
        errors.email='User not found!';
    }
    if(e.message==='Incorrect password for the given email id :('){
        errors.password='Incorrect password for the given email id :(';
    }
    if(e.code==11000){
        errors[username]="That username is already registered";
        return errors;
    }
    if(e.code==11000){
        errors[email]="That email is already registered";
        return errors;
    }
    if(e.message.includes('User validation failed')){
        Object.values(e.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        });
    }
    return errors;
}

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'hakuna-matata',{expiresIn: maxAge});
}


const signup_get=(req,res)=>{
    res.render('signup',{title: 'Sign Up'});
}

const signup_post= async (req,res)=>{
    const { email, password, username, age }=req.body;
    try{
        const user= await User.create({email, password, username, age});
        const token=createToken(user._id);
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});

    } catch(e){
        const errors=handleErrors(e);
        //console.log(e);
        res.status(400).json({errors});
    }
    //res.send('signup');
}

const login_get=(req,res)=>{
    res.render('login',{title: 'Login'});
}

const login_post= async (req,res)=>{
    const { email, password }=req.body;
    try{
        let userr= await User.findOne({email: email});
        const user = await User.login({email: email, password: password, username: userr.username, age: userr.age});
        const token=createToken(user._id);
        res.cookie('jwt',token,{ httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }catch (e){
        const errors=handleErrors_login(e);
        console.log(errors);
        res.status(400).json({errors});
    }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
module.exports={
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}