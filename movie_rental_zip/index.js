const express = require('express');
const app = express();
//const log = require('./middleware/log');
// const auth = require('./middleware/auth');
// const config = require('config');
const debug_start = require('debug')('movie:start');
//const debug_data = require('debug')('movie:database');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
require('express-async-errors');
// const genres = require('./routes/genres');
// const home = require('./routes/home');
// const customers = require('./routes/customers');
// const movies = require('./routes/movies');
// const rentals = require('./routes/rentals');
// const users = require('./routes/users');
// const logins = require('./routes/logins');
// const error = require('./middleware/error');
//const winston = require('winston');
//require('winston-mongodb');
//let Joi = require('joi');
//Joi.objectId = require('joi-objectid')(Joi);
require('./startup/morgan')(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/validate')();

//winston.configure({transports:[new winston.transports.File({filename:'logfile.log',level:'error'}),new winston.transports.MongoDB({db:'mongodb://localhost/movies_rental',level:'info'})]})

// mongoose.connect(config.get('db'))
// .then(()=>console.log("connected to database"))
// .catch((err)=>console.log("error",err));


// app.use(express.json());
// app.use(log);
// app.use(morgan('tiny'));
// app.use(express.static('public'));
// app.use('/api/genres',genres);
// app.use('/',home);
// app.use('/api/customers',customers);
// app.use('/api/movies',movies);
// app.use('/api/rentals',rentals);
// app.use('/api/users',users);
// app.use('/api/login',logins);
// app.use(error);

// process.on('uncaughtException',(ex)=>{
//     winston.error(ex.message,ex);
//     process.exit(1);
// })
// process.on('unhandledRejection',(ex)=>{
//     winston.error(ex.message,ex);
//     process.exit(1);
// })


// if(!config.get('jwtPrivateKey')){
//     console.error('Fatal Error: jwtPrivateKey is not defined');
//     process.exit(1);
// }


// console.log(process.env.NODE_ENV);
// console.log(config.get('db'));
// console.log(app.get('env'));

// if(app.get('env')==='production'){
//     app.use(morgan('tiny'));
// }


const port = process.env.PORT || 3000;
if(process.env.PORT !== 'test' ){
    app.listen(port,()=>{
        debug_start(`listening on port ${port}`);
    })
}

module.exports = app;