const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const Joi = require('joi');

router.post('/',async (req,res)=>{
    const {error} = validateLogin(req.body);
    if(error) return res.status(400).send(error.details[0].message);
 
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid Input');
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword) return res.status(400).send('Invalid Input');
        const token = user.getAuthToken();
        res.send(token);
})


function validateLogin(user){
    const schema = {
        email:Joi.string().required().min(5).max(255).email(),
        password:Joi.string().required().min(5).max(1024),
    }
    return Joi.validate(user,schema);   
}
module.exports = router;