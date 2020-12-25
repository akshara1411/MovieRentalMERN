const express = require('express');
const router = express.Router();
const {Movie,validateMovie} = require('../models/movie')
const {Genre} = require('../models/genre')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')


router.get('/count',async (req,res)=>{
    const {genreName,title} = req.query;
    let query = {};
    if(genreName) query['genre.name'] = genreName;
    if(title) query["title"] = new RegExp(title,"i")
    console.log(query);
    const count = await Movie.find(query).count();
    res.send({totalMovies:count});
})

router.get('/',async (req,res)=>{
    const {pageSize,currentPage,genreName,title,path,order} = req.query;
    let query = {};
    if(genreName) query['genre.name'] = genreName;
    if(title) query["title"] = new RegExp(title,"i")
    let skip = 0;
    let limit = 0;
    let sort = {};
    if(pageSize) limit=parseInt(pageSize);
    if(path && order) sort[path] = order;
    console.log(req.query)
    if(currentPage && pageSize) skip=(parseInt(currentPage)-1)*parseInt(pageSize)
    const movies = await Movie.find(query).skip(skip).limit(limit).sort(sort);
    console.log(movies.length)
    res.send(movies);
})

router.get('/:id',async(req,res)=>{
    const movie =  await Movie.findById(req.params.id);
    res.send(movie);
})

router.post('/',auth,async(req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Not Found');
    
    let movie = new Movie({
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id:genre._id,
            name:genre.name
        }
    })
    movie = await movie.save();
    res.send(movie);
})

router.put('/:id',auth,async (req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('Not Found');
    let genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Not Found');
    movie.title = req.body.title;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    movie.genre = {
        _id:genre._id,
        name:genre.name
    };
    movie = await movie.save();
    res.send(movie);
})


router.delete('/:id',[auth,admin],async(req,res)=>{
    let movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('Not found');
    res.send(movie);
})

module.exports= router;   