const express = require('express');
const router = express();
const {Customer,inputVal} = require('../models/customer.js');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/',async (req,res)=>{
    const customers = await Customer.find();
    res.send(customers);
})

router.get('/:id',async (req,res)=>{
    const customer = await Customer.findById(req.params.id)
    res.send(customer);
})


router.post('/',auth,async (req,res)=>{
    const {error} = inputVal(req.body);
    if(error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    let customer = new Customer({
        name:req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    })
    try{
       customer =  await customer.save();
       res.send(customer);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    } 
})


router.put('/:id',auth,async (req,res)=>{
    const {error} = inputVal(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Not found');
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;
    customer = await customer.save();
    res.send(customer);
})

router.patch('/:id',auth,async (req,res)=>{
    let customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('Not found');
    const {name,isGold,phone} = req.body;
    if(name)customer.name = name;
    if(isGold)customer.isGold = isGold;
    if(phone)customer.phone = phone;
    customer = await customer.save();
    res.send(customer);
})

router.delete('/:id',[auth,admin],async(req,res)=>{
    let customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send('Not found');
    res.send(customer);
})

module.exports = router;