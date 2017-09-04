'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals

    //  require the app modules
    const express       = require('express');
    const path          = require('path');
    const bodyParser    = require('body-parser');
    const app           = express();

    //  the routes
    const index         = require('./routes/index');
    
    // view engine parameters setup
    app.set('views', path.join(__dirname, 'views'));  
    app.set('view engine', 'pug'); 

    //  NOTE TO SELF: Establish the Routes
    //  Routing refers to determining how an application responds to a client request to a particular endpoint, 
    //  which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). 
    //  Each route can have one or more handler functions, which are executed when the route is matched.
    //  The default route is './routes/index.js' (index)
    //  File names without extensions are assumed to be filename.js

    //  use the routes to get the app rolling
    app.use('/', index);

    //  prepare to use json parsing
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //  rename public to static
    app.use('/static', express.static(path.join(__dirname, 'public')));
    
    //  In Express a 404 is not the result of an error but rather the app running out of options. 
    //  Once the request doesn't match any of the routes, it will reach the following function.
    app.use(function(req, res, next) {  
        var err = new Error('No Route Found');
        err.status = 404;
        next(err);
    });

    //  Error Handling
    //  First -- in the Development environment only -- show the stack trace
    if (app.get('env') === 'development') {  
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    
    //  Error Handling (continued)
    //  Next -- in all environments -- show the error message.
    app.use(function(err, req, res, next) {  
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    module.exports = app;
    
}());
