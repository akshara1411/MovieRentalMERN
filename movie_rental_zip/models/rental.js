const Joi = require('joi');
const mongoose = require('mongoose');
const {customerSchema} = require('./customer');

const rentalSchema = new mongoose.Schema({
    customer:{
    type:customerSchema,   
    required:true
},
    movie:{
        type:new mongoose.Schema({
            title:{
                type:String,
                required:true,
                maxlength:255,
                minlength:5
            },
            dailyRentalRate:{
                type:Number,
                min:0,
                max:255,
                required:true
            },
        }),
        required:true
    },
    dateOut:{
        type:Date,
        default:Date.now,
        required:true
    },
    dateIn:Date,
    rentalFee:{
        type:Number,
        min:0
    }
})

const Rental = mongoose.model('Rental',rentalSchema);

function validateRental(rental){
    const schema = {
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required()
    }
    return Joi.validate(rental,schema);
}

module.exports.Rental = Rental;
module.exports.rentalSchema = rentalSchema;
module.exports.validateRental = validateRental;
