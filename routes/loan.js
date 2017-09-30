'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    const express       = require('express');
    const router        = express.Router();
    const moment        = require('moment');

    const today         = moment().format('YYYY[-]MM[-]DD');
    const weekFromToday = moment().add(7, 'days').format('YYYY[-]MM[-]DD');

    const Book          = require('../models').Book;
    const Loan          = require('../models').Loan;
    const Patron        = require('../models').Patron;
    
    let entity          = 'loan';
    
    let currPage;
    let filter;
    
    // ==========================================================================
    //  ROUTER STRUCTURE
    //      1. New Loan processing
    //      2. Loan queries/listings
    // ==========================================================================
    
    //  1. GET response for "new loan" request
    //  =========================================================================
    router.get('/new', (req, res, next) => {
        const title = 'New Loan';
        //  gather the books for the drop down selector
        const books = Book.findAll({
            attributes: [
                ['id', 'id'],
                ['title', 'title']
            ]
        });
        
        //  gather the patron for the drop down selector
        const patrons = Patron.findAll({
            attributes: [
                ['id', 'id'],
                [Patron.sequelize.literal('first_name || " " || last_name'), 'name'],
            ]
        });
        // data is gathered - render the form
        Promise.all([books, patrons])
        .then(data => {
            // pass the parameters
            const books = data[0].map(book => {
                return Object.assign({}, {
                    id: book.dataValues.id,
                    title: book.dataValues.title
                });
            });
            const patrons = data[1].map(patron => {
                return Object.assign({}, {
                    id: patron.dataValues.id,
                    fullName: patron.dataValues.name
                });
            });
            const loanedOn = today;
            const returnBy = weekFromToday;
            //render the form
            res.render('new_selector', { 
                entity,
                title, 
                books, 
                patrons, 
                today, 
                weekFromToday 
            });
        });
    });
    
    // POST the new loan
    router.post('/new', (req, res, next) => {
    
        const books = Book.findAll({
            attributes: [
                ['id', 'id'],
                ['title', 'title']
            ]
        });
    
        const patrons = Patron.findAll({
            attributes: [
                ['id', 'id'],
                [Patron.sequelize.literal('first_name || " " || last_name'), 'name'],
            ]
        });
    
        Promise.all([books, patrons])
        .then(data => {
            const special = /[!@#$%^&*()_+=<>,.'";:`~]+/ig;
            const dateMatch = /^\d{4}-\d{2}-\d{2}$/igm;
            const errors = [];
            const books = data[0].map(book => {
                return Object.assign({}, {
                    id: book.dataValues.id,
                    title: book.dataValues.title
                });
            });
    
            const patrons = data[1].map(patron => {
                return Object.assign({}, {
                    id: patron.dataValues.id,
                    fullName: patron.dataValues.name
                });
            });
    
            if (special.test(req.body.loaned_on)) {
                errors.push(new Error('The loaned on date must be in the correct format. ex. 2017-07-08'));
            }
    
            if (special.test(req.body.return_by)) {
                errors.push(new Error('The return by date must be in the correct format. ex. 2017-07-08'));
            }
    
            if (errors.length) {
                // there are errors so errors are passed
                res.render('new_selector', { 
                    entity,
                    title,
                    books, 
                    patrons, 
                    today, 
                    weekFromToday,
                    errors 
                });
            } else {
                Loan.create(req.body).then(() => {
                    res.redirect('/loan/new');
                }).catch(error => {
                    // if there is a validation error
                    if (error.name === 'SequelizeValidationError') {
                        res.render('new_selector', { 
                            entity,
                            title,
                            books, 
                            patrons,
                            today, 
                            weekFromToday, 
                            errors: error.errors 
                        });
                    }
                    else {
                        res.status(500).send(error);
                    }
                });
            }
        });
    });
    
    //
    //  identification of query parameters
    //
    //      loanQuery           = the resuting query and is conditionally built
    //      req.query.page      = a requested page number (may be undefined)
    //      req.query.filter    = the requested lisitng filter (All/Checked Out/Overdue)
    //      req.query.search    = the indicator that a specific search is called for
    //    

    //  2. Set Up the Loan Queries (listings)
    //  =========================================================================
    router.get('/', (req, res, next) => {
        // no page selected - so page = 1
        if (req.query.page === undefined && req.query.filter === undefined) {
            res.redirect(
                '/loan?page=1'
            );
        }

        let loanQuery;
    
        loanQuery = Loan.findAndCountAll({
            where: [{
                loaned_on: {
                    $not: null
                },
            }],
            order: [
                ['patron_id', 'ASC'],
                ['returned_on', 'ASC']
            ],
            include: [{                              // join to
                model: Book,                         // Book
                attributes: [                        // bring back
                    ['id', 'id'],                    // id AND
                    ['title', 'title']               // title
                ]
            }, {                                     // also join to
                model: Patron,                       // Patron
                attributes: [                        // bring back
                    ['id', 'id'],                    // id AND
                    ['first_name', 'first_name'],    // first_name AND
                    ['last_name', 'last_name'],      // last_name
                ]
            }],
            offset: (req.query.page * 10) - 10,
            limit: 10
        });
    
        if (req.query.filter === 'checked_out') {
            loanQuery = Loan.findAndCountAll({
                where: [{
                    loaned_on: {
                        $not: null
                    },
                    returned_on: null
                }],
                order: [
                    ['patron_id', 'ASC'],
                    ['returned_on', 'ASC']
                ],
                include: [{
                    model: Book,
                    attributes: [
                        ['id', 'id'],
                        ['title', 'title']
                    ]
                }, {
                    model: Patron,
                    attributes: [
                        ['id', 'id'],
                        ['first_name', 'first_name'],
                        ['last_name', 'last_name'],
                    ]
                }],
                offset: (req.query.page * 10) - 10,
                limit: 10
            });
        }
        
        if (req.query.filter === 'overdue') {
            loanQuery = Loan.findAndCountAll({
                where: [{
                    loaned_on: {
                        $not: null
                    },
                    returned_on: null,
                    return_by: {
                        $lt: today
                    },
                }],
                order: [
                    ['patron_id', 'ASC'],
                    ['returned_on', 'ASC']
                ],
                include: [{
                    model: Book,
                    attributes: [
                        ['id', 'id'],
                        ['title', 'title']
                    ]
                }, {
                    model: Patron,
                    attributes: [
                        ['id', 'id'],
                        ['first_name', 'first_name'],
                        ['last_name', 'last_name'],
                    ]
                }],
                offset: (req.query.page * 10) - 10,
                limit: 10
            });
        }
    
        loanQuery.then(loans => {
    
            currPage = req.query.page;
            if ( req.query.filter === 'checked_out' ) {
                filter = 'Checked Out'
            }
            else if ( req.query.filter === 'overdue' ) {
                filter = 'Overdue'
            }
            else { 
                filter = 'All'
            }

            const columns = [
                "Book",
                "Patron",
                "Loaned On",
                "Return By",
                "Returned On"
            ];
    
            const loanedBooks = loans.rows.map(loan => {
                return loan.get({
                    plain: true
                });
            });
            
            let pgCount = Math.ceil(loans.count / 10);
    
            const title = "Loans";
    
            res.render('list_selector', { 
                entity, 
                pgCount, 
                currPage, 
                filter, 
                loanedBooks, 
                columns, 
                title 
            });
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    
    module.exports = router;
    
}());
