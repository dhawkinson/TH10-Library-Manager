'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    const express       = require('express');
    const bodyParser    = require('body-parser');
    const cookieParser  = require('cookie-parser');
    const path          = require('path');
    const favicon       = require('serve-favicon');
    
    const app           = express();
    
    //  NOTE TO SELF: Establish the Routes
    //  Routing refers to determining how an application responds to a client request to a particular endpoint, 
    //  which is a URI (or path) and a specific HTTP request method (GET, POST, and so on). 
    //  Each route can have one or more handler functions, which are executed when the route is matched.
    //  The default route is index.js './routes' (homeRte)
    //  File names without extensions are assumed to be filename.js

    const homeRte       = require('./routes');
    const bookRte       = require('./routes/books');
    const loanRte       = require('./routes/loans');
    const patronRte     = require('./routes/patrons');

    app.use(favicon(path.join(__dirname, 'public', 'images/hawk.ico')));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use('static', express.static(path.join(__dirname, 'public')));
    
    //  use the routes
    app.use('/', homeRte);
    app.use('/books', bookRte);
    app.use('/loans', loanRte);
    app.use('/patrons', patronRte);
    
    module.exports = app;
    
}());
