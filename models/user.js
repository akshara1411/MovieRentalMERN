const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})
userSchema.methods.getAuthToken=function(){
    return jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
}
const User = mongoose.model('User',userSchema)

function validateUser(user){
    const schema = {
        name:Joi.string().required().min(5).max(50),
        email:Joi.string().required().min(5).max(255).email(),
        password:Joi.string().required().min(5).max(1024),
        isAdmin:Joi.boolean()
    }
    return Joi.validate(user,schema);

}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;

