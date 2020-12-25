const express = require('express');
const router = express();
router.use(express.json());

router.get('/',(req,res)=>{
    res.send("Welcome to Movie Rentals");
})

module.exports = router;

