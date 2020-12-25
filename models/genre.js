const mongoose = require('mongoose');
const Joi = require('joi');

const genresSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            minlength:5,
            maxlength:255, 
        }
    })
const Genre = mongoose.model('Genre',genresSchema)


function inputVal(genre){
    const schema = {
        _id:Joi.objectId(),
        name:Joi.string().required().min(5).max(255)
    }
    return Joi.validate(genre,schema);
}

module.exports.Genre = Genre;
module.exports.genresSchema = genresSchema;
module.exports.inputVal = inputVal;
