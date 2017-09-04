'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals

    const express    = require('express');
    const router     = express.Router();
    
    //  home route
    //  NOTE TO SELF:   the 'next' parameter is optional
    //                  'next' would end the router function and execute the next router function
    //                  in this case, the render serves to end the router funtion by
    //                  rendering the 'home' page
    //                  'req' -- the request -- what the server gets from the user
    //                  'res' -- the response -- what the server sends back to the user
    //                  see http://jilles.me/express-routing-the-beginners-guide/ for a fuller explanation
    router.get('/', function(req, res, next) {  
        res.render('entities');       // GET & Render home page (home.pug)
    });
    
    module.exports = router;
}());
