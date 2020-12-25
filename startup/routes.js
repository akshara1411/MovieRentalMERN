const express = require('express');
const genres = require('../routes/genres');
const home = require('../routes/home');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const logins = require('../routes/logins');
const error = require('../middleware/error');
const cors = require('cors');

module.exports = function(app){
    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));
    app.use('/api/genres',genres);
    app.use('/',home);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',users);
    app.use('/api/login',logins);
    app.use(error);
}
