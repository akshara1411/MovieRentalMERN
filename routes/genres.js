const express = require('express');
const router = express();
router.use(express.json());
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre,inputVal} = require('../models/genre.js');
const  mongoose  = require('mongoose');
const validateObjId = require('../middleware/validateObjId');
//const asyncErrorMiddleware = require('../middleware/asyncErrorMiddleware')

router.get('/',async (req,res)=>{
        const genres = await Genre.find();
        res.send(genres);
})

router.get('/:id',validateObjId,async (req,res,next)=>{
    const genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send('genre not found');
    res.send(genre);
})


router.post('/',auth,async (req,res)=>{
    const {error} = inputVal(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({
        name:req.body.name
    })
       genre =  await genre.save();
       res.send(genre);
})


router.put('/:id',auth,async (req,res)=>{
    const {error} = inputVal(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let genre = await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('Not found');
    genre.name = req.body.name;
        genre = await genre.save();
        res.send(genre);

})


router.delete('/:id',[auth,admin],async(req,res)=>{
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send('Not found');
    res.send(genre);
})

module.exports = router;

