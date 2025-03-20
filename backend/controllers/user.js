const {USER, bcrypt, validate} = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {

    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        const {firstName, lastName, username, email, password} = req.body;
    
        const oldUser = await USER.findOne({email});
        if (oldUser) return res.status(400).send("User already exists");
    
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
    
        let user = await USER.create({
            firstName,
            lastName,
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        })
    
        // generate jwt token
    
        const token = jwt.sign({userId: user._id, email}, process.env.TOKEN_SECRET, {expiresIn: "2h"});
    
        user.token = token;
    
        res.status(201).send(user); 
    } catch (error) {
        console.log(error);
    }
}