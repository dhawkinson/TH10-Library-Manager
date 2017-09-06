'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
	// still maintains access to all globals

    const express       = require('express');
    const appRouter     = express.Router();
    const entityRouter  = express.Router();
    //const entityRouter  = express.Router({mergeParams: true});

    const app           = express;


    //  execute the routing
    //      Steps
    //          1. go to the root
    //          2. select the entity to act on (Books/Patrons/Loans on top menu level)
    //          3. pass the entity selection back to the router
    //          4. route to the entity selection
    //

    let entity = '';

    appRouter.get('/', function(req, res) {          //  go to the root
        Promise.all([
            // render the index page (root route)
            res.render('home')
        ])
        .then(selectFromAppMenu)
        .then(getEntityMenu)
        .catch(err => {
            //  deals only with errors related to the promise (not HTTP errors)
            console.log('Caught error in rendering ', err);
        });
    });

    function selectFromAppMenu() {
        $('.pageNav').on('click', 'a', function(c){ //  click listener
            var clickSel = c.target.textContent;    //  value of the menu clicked
            if ( clickSel === 'Books' ) {           //  Books
                entity ='book';
            } else if ( clickSel === 'Patrons' ) {  //  Patrons
                entity = 'patron';
            }  else if ( clickSel === 'Loans' ) {   //  Loans
                entity = 'loan';
            }
            return entity;
        });
    }

    function getEntityMenu() {
        if ( entity === 'books' ) {
            entityRouter.get('/books', function(req, res, next){
                next();
            });
        }
        else if ( entity === 'patrons' ) {
            entityRouter.get('/patrons', function(req, res, next){
                next();
            });
        }
        else if ( entity === 'loans' ) {
            entityRouter.get('/loans', function(req, res, next){
                next();
            });
        }
        return eitityRouter
    }
    
    module.exports = {
        'appRouter'     : appRouter,
        'entity'        : entity,
        'entityRouter'  : entityRouter,
    };
}());
