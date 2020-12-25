const winston = require('winston');

module.exports = function(err,req,res,next){
    winston.log('error',err.message);
    return res.status(500).send('something failed');
}