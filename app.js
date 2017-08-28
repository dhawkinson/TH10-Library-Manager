'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    const express      = require('express');
    const path         = require('path');
    const favicon      = require('serve-favicon');
    const logger       = require('morgan');
    const cookieParser = require('cookie-parser');
    const bodyParser   = require('body-parser');
    
    const app          = express();
    
    //  Establish the Routes
    //  Routing refers to determining how an application responds to a client request to a particular endpoint, 
    //  which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). 
    //  Each route can have one or more handler functions, which are executed when the route is matched.
    //  The default route is index.js './routes'
    //  File names without extensions are assumed to be filename.js

    const home         = require('./routes');
    const book         = require('./routes/books');
    const loan         = require('./routes/loans');
    const patron       = require('./routes/patrons');
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    
    app.use(favicon(path.join(__dirname, 'public', 'hawk.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    
    //  use the routes
    app.use('/', home);
    app.use('/books', book);
    app.use('/loans', loan);
    app.use('/patrons', patron);
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
            let err = new Error('Not Found');
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
    
}());
