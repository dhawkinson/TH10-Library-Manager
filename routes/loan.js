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
    
    // GET new loan creator
    router.get('/new', (req, res, next) => {
    
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
    
        Promise.all([books, patrons]).then(data => {
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
    
            res.render('new_selector', { entity, books, patrons, today, weekFromToday });
        });
    });
    
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
    
        Promise.all([books, patrons]).then(data => {
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
                errors.push(new Error('The return by date must be in the correct format. ex. 2017-07-08'));
            }
    
            if (special.test(req.body.return_by)) {
                errors.push(new Error('The return by date must be in the correct format. ex. 2017-07-08'));
            }
    
            if (errors.length) {
                res.render('new_selector', { today, weekFromToday, books, patrons, errors, title: 'New Loan', entity });
            } else {
                Loan.create(req.body).then(() => {
                    res.redirect('/loan');
                }).catch(error => {
                    if (error.name === 'SequelizeValidationError') {
                        res.render('new_selector', { today, weekFromToday, books, patrons, errors: error.errors, title: 'New Loan', entity });
                    }
                }).catch(error => {
                    res.status(500).send(error);
                });
            }
        });
    });

    //  GET loan listings  
    router.get('/', (req, res, next) => {
    
        if (req.query.page === undefined && req.query.filter === undefined) {
            res.redirect('/loan?page=1');
        }
    
        let loanQuery = Loan.findAndCountAll({
            where: [{
                loaned_on: {
                    $not: null
                },
            }],
            order: [
                ['patron_id', 'ASC'],
                ['returned_on', 'ASC']
            ],
            limit: 10,
            offset: (req.query.page * 10) - 10,
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
            }]
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
                limit: 10,
                offset: (req.query.page * 10) - 10,
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
                }]
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
                limit: 10,
                offset: (req.query.page * 10) - 10,
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
                }]
            });
        }
    
        loanQuery.then(loans => {
            const columns = [
                "Book",
                "Patron",
                "Loaned On",
                "Return By",
                "Returned On"
            ];
    
            const count = Math.ceil(loans.count / 10);
    
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
    
            let loanedBooks = loans.rows.map(loan => {
                return loan.get({
                    plain: true
                });
            });
    
            const title = "Loans";
    
            res.render('list_selector', { loanedBooks, count, filter, currPage, columns, title, entity });
        });
    });
    
    module.exports = router;
}());
