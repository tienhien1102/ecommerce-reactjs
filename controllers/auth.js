const User = require('../models/user');
const {errorHandler} =  require("../helpers/dbErrorHandler");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')

exports.signup = (req, res) => {
    console.log(req.body);
    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    const {email, password}    = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                err: "User with that mail does not exist. Please signup"
            }) 
        }
         // if user is foudn make sure  the email and password match
        //create authenticate method in user model 
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password not match"
            })
        }

         //generate s signed token with user id and secret 
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        //persist the token  as 't' on cookie with expiry date
        res.cookie('t', token, {expire: new Date() + 9999})
        // return  response with user and token to frontend client 
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id, email, name, role}});
    })
   
   
}

exports.signout = (req, res) =>{
    res.clearCookie("t");
    res.json({message: "Singout success"});
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"

})