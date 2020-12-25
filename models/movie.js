const mongoose = require('mongoose');
const Joi = require('joi');
const {Genre,genresSchema} = require('./genre');


const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:255,
        minlength:5
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number,
        min:0,
        max:255,
        required:true
    },
    genre:{
        type:genresSchema,
        required:true
    }
})
const Movie = mongoose.model('Movie',movieSchema)

function validateMovie(movie){
    const schema = {
        _id:Joi.objectId(),
        title:Joi.string().required().min(5).max(255),
        numberInStock:Joi.number().required().min(0).max(255),
        dailyRentalRate:Joi.number().min(0).max(255).required(),
        genreId:Joi.objectId().required()
    }
    return Joi.validate(movie,schema);
}


module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;