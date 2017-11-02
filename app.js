'use strict';


//  require the app modules
const express       = require('express');           //  imports the framework into the app
const bodyParser    = require('body-parser');       //  will add a body object to request to access POST parameters
const cookieParser  = require('cookie-parser');     //  Parse Cookie header/populate req.cookies
const path          = require('path');              //  a core Node module for working with and handling paths

//  define the routes
const home     = require('./routes/index');
const book     = require('./routes/book');
const patron   = require('./routes/patron');
const loan     = require('./routes/loan');

const app           = express();

//  prepare to use json parsing
app.use(bodyParser.json());                             //  ability to parse JSON. Necessary for sending data
app.use(bodyParser.urlencoded({ extended: false }));    //  to read data from URLs (GET requests)
app.use(cookieParser());

// view engine parameters setup
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'pug');

//  identify public as static
//  tells Express to match any routes for files found in this folder and deliver the files directly to the browser
app.use('/static', express.static(path.join(__dirname, 'public')));

//  NOTE TO SELF: Establish the Routes
//  Routing refers to determining how an application responds to a client request to a particular endpoint, 
//  which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). 
//  Each route can have one or more handler functions, which are executed when the route is matched.
//  The default route is './routes/index.js' (index)
//  File names without extensions are assumed to be filename.js

//  use the routes (API end points)
app.use('/', home);            //  route to home page
app.use('/book', book);        //  route to books
app.use('/patron', patron);    //  route to patrons
app.use('/loan', loan)         //  route to loans of books

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
