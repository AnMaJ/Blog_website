const jwt=require('jsonwebtoken');
const User = require('../models/user');

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'hakuna-matata',(e,decodedToken)=>{
            if(e){
                console.log(e);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login');
    }
}

const checkUser= (req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'hakuna-matata',async (e,decodedToken)=>{
            if(e){
                console.log(e);
                res.locals.user=null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user=user;
                next();
            }
        });
    }else{
        res.locals.user=null;
        next();
    }
}

module.exports={
    requireAuth,
    checkUser
};