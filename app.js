var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var slackRoutes = require('./src/api/slack');
var vendorRoutes = require('./src/api/vendors');
var orderRoutes = require('./src/api/orders');
var itemRoutes = require('./src/api/items');
var printRoute = require('./src/api/print');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/slack', slackRoutes);
app.use('/vendors', vendorRoutes);
app.use('/orders', orderRoutes);
app.use('/items', itemRoutes);
app.use('/print', printRoute);

// 404
app.use((req, res) => {
    res.status(404).send({
        status: 404,
        message: 'The requested resource was not found',
    });
});

// 5xx
app.use((err, req, res) => {
    log.error(err.stack);
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong, we\'re looking into it...'
        : err.stack;
    res.status(500).send({
        status: 500,
        message,
    });
});

module.exports = app;
