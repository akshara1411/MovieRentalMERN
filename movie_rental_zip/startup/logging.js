const winston = require('winston');
require('winston-mongodb')
module.exports = function(){
    winston.configure({transports:[new winston.transports.File({filename:'logfile.log',level:'error'}),new winston.transports.Console({format:winston.format.combine(winston.format.prettyPrint(),winston.format.colorize({all:true}))}),new winston.transports.MongoDB({db:'mongodb://localhost/movies_rental',level:'error'})]})
    process.on('uncaughtException',(ex)=>{
        winston.error(ex.message,ex);
        process.exit(1);
    })
    process.on('unhandledRejection',(ex)=>{
        winston.error(ex.message,ex);
        process.exit(1);
    })
}