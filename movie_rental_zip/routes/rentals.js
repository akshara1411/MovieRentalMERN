const express = require('express');
const router = express.Router();
const {Rental,validateRental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');
const  mongoose  = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

Fawn.init(mongoose);

router.get('/',async(req,res)=>{
    const rentals = await Rental.find();
    res.send(rentals);
})

router.get('/:id',async (req,res)=>{
    const rental = await Rental.findById(req.params.id);
    res.send(rental);
})

router.post('/',auth,async (req,res)=>{
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Not Found');
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Not Found');

    let rental = new Rental({
        customer:{
            name:customer.name,
            _id:customer._id,
            phone:customer.phone,
            isGold:customer.isGold
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        },
        rentalFee:20,
    })
        new Fawn.Task()
        .save("rentals",rental)
        .update('movies',{_id:movie._id},{
            $inc:{
                numberInStock:-1
            }
        })
        .run()
        res.send(rental);
})

router.put('/:id',auth, async(req,res)=>{
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let rentalsDb = await Rental.findById(req.params.id);
    if(!rentalsDb) return res.status(400).send("Invalid input");

    if(rentalsDb.customer._id != req.body.customerId){
        const customer = await Customer.findById(req.body.customerId);
        if(!customer) return res.status(400).send("Invalid input");

        rentalsDb.customer = {
            name:customer.name,
            _id:customer._id,
            phone:customer.phone,
            isGold:customer.isGold
        }
    }

    if(rentalsDb.movie._id != req.body.movieId){
        const movie = await Movie.findById(req.body.movieId);
        if(!movie) return res.status(400).send("Invalid input");

        if(movie.numberInStock<=0) return res.status(400).send("Movie is not in stock");
        const oldMovie = rentalsDb.movie;
        rentalsDb.movie = {
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
        new Fawn.Task()
        .update('rentals',{_id:rentalsDb._id},{
            $set:{
                movie:movie,
                customer:rentalsDb.customer,
                dateOut:rentalsDb.dateOut,
                rentalFee:rentalsDb.rentalFee,
                dateIn:rentalsDb.dateIn
            }
        })
        .update("movies",{_id:oldMovie._id},{
            $inc:{
                numberInStock:1
            }
        })
        .update("movies",{_id:movie._id},{
            $inc:{
                numberInStock:1
            }
        })
        .run()
        res.send(rentalsDb);
    }
    else{
        await rentalsDb.save();
        res.send(rentalsDb);
    }
})

router.patch('/:id',auth,async(req,res)=>{
    let rentalsDb = await Rental.findById(req.params.id);
    if(!rentalsDb) return res.status(400).send("Invalid input");
    rentalsDb.dateIn= new Date();
        new Fawn.Task()
        .update('rentals',{_id:rentalsDb._id},{
            $set:{
                dateIn:rentalsDb.dateIn
            }
        })
        .update('movies',{_id:rentalsDb.movie._id},{
            $inc:{
                numberInStock:1
            }
        })
        .run()
        res.send(rentalsDb);
  
})

router.delete('/:id',[auth,admin],async (req,res)=>{
    let rental = await Rental.findByIdAndDelete(req.params.id);
    if(!rental) return res.status(404).send('Not Found');
    res.send(rental);
})

module.exports = router;

