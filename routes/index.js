'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals

    const express    = require('express');
    const router     = express.Router();
    
    //  home route
    router.get('/', function(req, res, next) {
        res.render('home');       // GET & Render home page (home.pug)
    });
    
    module.exports = router;
}());
