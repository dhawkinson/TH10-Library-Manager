'use strict';

const express   = require('express');
const router    = express.Router();
const Patron    = require('../models').Patron;
const Loan      = require('../models').Loan;
const Book      = require('../models').Book;

let entity      = 'patron';

let currPage;   //  initialize current page
let filter;     //  filter is really a placeholder for Patrons
let search;     // initialize search flag

// ==========================================================================
//  ROUTER STRUCTURE
//      1. New Patron processing
//      2. Patron queries/listings
//      3. Patron detail processing
// ==========================================================================

//  1. GET response for "new patron" request
//  =========================================================================
router.get('/new', (req, res, next) => {
    const title = 'New Patron';
    res.render('new_selector', {
        entity,
        title,
        patronRow: {}
    });
});

router.post('/new', (req, res, next) => {
    Patron.create(req.body)
    .then(() => {res.redirect(
        '/patron/new'
        );}
    )
    .catch(error => {
        // if the error is a validation error - retry
        if (error.name === "SequelizeValidationError") {
            const patron = Patron.build(req.body);
            const patronData = patron.get({
                plain: true
            });

            res.render('new_selector', { 
                entity, 
                title: 'New Patron',
                patronRow: patronData, 
                errors: error.errors
            });
        }
        else {
            res.status(500).send(error);
        }
    });
});   

//
//  identification of query parameters
//
//      ParonQuery          = the resuting query and is conditionally built
//      req.query.page      = a requested page number (may be undefined)
//      req.query.filter    = the requested lisitng filter (All/Checked Out/Overdue)
//      req.query.search    = the indicator that a specific search is called for
//    

//  =========================================================================
//  2. Set Up the Patron Queries (listings)
//  =========================================================================


// GET patron listing parameters
router.get('/', (req, res, next) => {
   
    Patron.findAll({
        order: [
            ['last_name', 'ASC'],
            ['first_name', 'ASC']
        ]
    }).then(patrons => {

        const columns = [
            "Name",
            "Address",
            "Email",
            "Library ID",
            "Zip"
        ];

        const patronData = patrons.map(patron => {
            return patron.get({
                plain: true
            });
        });

        const title = 'Patrons';
        let filter  = 'All'

        res.render('list_selector', { 
            entity, 
            title,
            filter, 
            columns, 
            patronData
        });
    });
});

//  3. Set Up the Patron Detail processing
//  =========================================================================
//  the result of clicking on a specific patron in the patron listing
router.get('/:id', (req, res, next) => {
    Patron.findById(req.params.id).then(patron => {

        const patronData = patron.get({
            plain: true
        });

        const patronName = patronData.full_name.split(' ').join('_');

        res.redirect(
            `/patron/${ req.params.id }/${ patronName }`
        );
    });
});

//  GET row for patron detail - from the redirect above
router.get('/:id/:name', (req, res, next) => {
    //  select the one row for the detail
    Patron.findOne({
        where: [{
            id: req.params.id
        }],
        // the following documented @ 
        // https://stackoverflow.com/questions/25880539/join-across-multiple-junction-tables-with-sequelize
        include: [{                     // joins to
            model: Loan,                // Loan
            include: [ Book ]           // which in turn joins to Book
        }]
    }).then(patron => {
        const patronRow = patron.get({
            plain: true
        });

        for (let loan of patronRow.Loans) {
            loan.Patron = {};
            loan.Patron.full_name = patronRow.full_name;
        }

        const patronDetail = true;

        const columns = [
            "Book",
            "Patron",
            "Loaned On",
            "Return By",
            "Returned On"
        ];

        const title = `Patron: ${ patronRow.full_name }`;
        
        //  NOTE: no errors to render on a new detail
        res.render('detail_selector', {
            entity,
            title,
            columns,
            patronDetail,
            patronRow,
            loanedBooks: patronRow.Loans
        });

    }).catch(err => {
        console.log(err);
    });
});

// POST row for patron detail
router.post('/:id/:name', (req, res, next) => {
    Patron.findOne({
        where: [{
            id: req.params.id
        }],
        // the following documented @ 
        // https://stackoverflow.com/questions/25880539/join-across-multiple-junction-tables-with-sequelize
        include: [{                     // joins to
            model: Loan,                // Loan
            include: [ Book ]           // which in turn joins to Book
        }]
    }).then(patron => {

        const patronRow = patron.get({
            plain: true
        });

        for (let loan of patronRow.Loans) {
            loan.Patron = {};
            loan.Patron.full_name = patronRow.full_name;
        }

        const patronDetail = true;

        const columns = [
            "Book",
            "Patron",
            "Loaned On",
            "Return By",
            "Returned On"
        ];

        const title = `Patron: ${ patronRow.full_name }`;

        Patron.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect('/patron');
        }).catch(error => {
            // if validation error - retry
            if (error.name === "SequelizeValidationError") {
                //  NOTE: there is a validation error so there are errors to render
                res.render('detail_selector', { 
                    entity,
                    title,
                    columns,
                    patronDetail,
                    patronRow,
                    loanedBooks: patronRow.Loans, 
                    errors: error.errors
                });
            } else {
                res.status(500).send(error);
            }
        });
    });
});
//  end of the Patron Detail processing
//  =========================================================================

module.exports = router;