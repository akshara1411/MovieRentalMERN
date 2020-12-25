const express = require('express');
const router = express.Router();
const {User,validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.post('/',auth,async (req,res)=>{
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send("User already registered");
     user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        isAdmin:req.body.isAdmin
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    res.send(_.pick(user,['name','email','_id','isAdmin']));
    
})


router.get('/me',auth,async(req,res)=>{
        const user = await User.findById(req.user._id).select({password:0});
        console.log(req.user);
        console.log(user);
        res.send(user);
})
module.exports = router;