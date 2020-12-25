const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50, 
    },
    isGold:{
        type:Boolean,
        default:false,
    },
    phone:{
        type:String,
        required:true,
        minlength:5,
        maxlength:10
    }
})
const Customer = mongoose.model('Customer',customerSchema)

function inputVal(customer){
    const schema = {
        _id:Joi.objectId(),
        name:Joi.string().required().min(5).max(50),
        phone:Joi.string().required().min(5).max(10),
        isGold:Joi.boolean()
    }
    return Joi.validate(customer,schema);
}

module.exports.Customer = Customer;
module.exports.customerSchema = customerSchema;
module.exports.inputVal = inputVal;
