'use strict';

const express   = require('express');
const router    = express.Router();
const moment    = require('moment');

const today     = moment().format('YYYY[-]MM[-]DD');

const Book      = require('../models').Book;            //  the Book Model
const Patron    = require('../models').Patron;          //  the Patron Model
const Loan      = require('../models').Loan;            //  the Loan Model

let entity      = 'book';

let workingQuery;
let bookDetail;
let currPage;
let filter;
let sub_title;
let search;
let search_title;
let genre;
let author;
let first_published;

// ==========================================================================
//  ROUTER STRUCTURE
//      1. New Book processing
//      2. Book queries/listings
//      3. Loaned Book return processing
//      4. Book detail processing
// ==========================================================================

//  =========================================================================
//  1. NEW Book processing
//          executes as a result of a click on the "New Book" navigation selection
//  =========================================================================
//  GET the new book form
router.get('/new', (req, res, next) => {
    const title = 'New Book';
    res.render('new_selector', { 
        entity,
        title, 
        bookRow: {}
    });
});
//  POST a new book to the database
router.post('/new', (req, res, next) => {
    Book.create(req.body)
    .then(() => {
        res.redirect(
        "/book?page=1"
        );
    })
    .catch(error => {
        // if the error is a validation error - retry
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            bookDetail = false;
            const book = Book.build(req.body);
            const bookData = book.get({
                plain: true
            });
            const errors = error.errors;
            res.render('new_selector', { 
                entity,
                title: "New Book",
                bookRow: bookData,
                bookDetail,  
                errors
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
//      workingQuery        = the resuting query and is conditionally built
//      req.query.page      = a requested page number (may be undefined)
//      req.query.filter    = the requested lisitng filter (All/Checked Out/Overdue)
//      req.query.search    = the indicator that a specific search is called for
//    

//  =========================================================================
//  2. Set Up the Book Queries (listings)
//      executes as a result of selecting a Book Listing navigation selection (All/Checked Out/Overdue)
//  =========================================================================

//  GET other listing parameters
router.get('/', (req, res, next) => {
    // no page selected - so page = 1
    if (req.query.page === undefined && req.query.filter === undefined) {
        req.query.page = 1;
    }

    //  set search flag to true or false
    search = req.query.search ? req.query.search : false;

    //  a query with no search parameters - the "All" listing
    if (req.query.search === undefined) {
        workingQuery = Book.findAndCountAll({
            order: [
                    ['title', 'ASC']
            ],
            offset: (req.query.page * 10) - 10,
            limit: 10
        });
    }


    //  query for Checked Out books (filter = checked_out)
    if (req.query.filter === 'checked_out') {
        workingQuery = Book.findAndCountAll({
            distinct: 'title',
            order: [
                ['title', 'ASC']
            ],
            include: {                              // join to
                model: Loan,                        // Loan (and bring back rows)
                where: {                            // where 
                    returned_on: null               // returned_on date is null
                }
            },
            offset: (req.query.page * 10) - 10,
            limit: 10
        });
    }
    
    //  query for Overdue books (filter = overdue)
    if (req.query.filter === 'overdue') {
        workingQuery = Book.findAndCountAll({
            distinct: 'title',
            order: [
                ['title', 'ASC']
            ],
            include: {                              // join to
                model: Loan,                        // Loan (and bring backs rows)
                where: {                            // where
                    return_by: { $lt: today },      // return_by date is earlier than today AND
                    returned_on: null               // returned_on date is null
                }
            },
            offset: (req.query.page * 10) - 10,
            limit: 10
        });
    }

    // query for books with search parameters (for pages other than page 1, page 1 handled in the POST above)
    if (req.query.search) {
        workingQuery = Book.findAndCountAll({
            where: {
                title: {
                        $like: `%${ req.query.title.toLowerCase() }%`,
                },
                author: {
                        $like: `%${ req.query.author.toLowerCase() }%`,
                },
                genre: {
                        $like: `%${ req.query.genre.toLowerCase() }%`,
                },
                first_published: {
                        $like: `%${ req.query.first_published }%`,
                }
            },
            offset: (req.query.page * 10) - 10,
            limit: 10
        });
    }

    // after establishing the correct query, render the resulting book query
    workingQuery.then(books => {
        // set the parameters
        currPage = req.query.page;
        filter = req.query.filter
        if ( filter === 'checked_out' ) {
            sub_title = 'Checked Out'
        }
        else if ( filter === 'overdue' ) {
            sub_title = 'Overdue'
        }
        else { 
            sub_title = 'All'
        }
        search_title = req.query.title;
        author = req.query.author;
        genre = req.query.genre;
        first_published = req.query.first_published;

        const columns = [
            "Title",
            "Author",
            "Genre",
            "First Published"
        ];

        const bookData = books.rows.map(book => {
            return book.get({
                plain: true
            });
        });

        const pgCount = Math.ceil(books.count / 10);

        const title = "Books";

        res.render('list_selector', {
            entity,
            title,
            columns,
            bookData,
            pgCount,
            currPage,
            filter,
            sub_title,
            search_title,
            author,
            genre,
            first_published,
            search
        });
    }).catch(error => {
        res.status(500).send(error);
    });
});

//  capture (POST) search query parameters (optional use)
//  =========================================================================
router.post('/', (req, res, next) => {
    
    // undefined page number and undefined filter indicates page = 1
    if (req.query.page === undefined && req.query.filter === undefined) {
        req.query.page = 1;
    }

    // use the req attributes to filter the query results
    Book.findAndCountAll({
        where: {
            title: {
                $like: `%${ req.body.title }%`,
            },
            author: {
                $like: `%${ req.body.author }%`,
            },
            genre: {
                $like: `%${ req.body.genre }%`,
            },
            first_published: {
                $like: `%${ req.body.first_published }%`,
            }
        },
        offset: (req.query.page * 10) - 10,
        limit: 10
    }).then(books => {
        // redirect to render the query filtered by search parameters (page=1)
        res.redirect(
            `/book?page=1&search=true&title=${ req.body.title ? req.body.title : '' }&author=${ req.body.author ? req.body.author : ''}&genre=${ req.body.genre ? req.body.genre : ''}&first_published=${ req.body.first_published ? req.body.first_published : ''}`
        );
    });
});

//  =========================================================================
//  3. Set Up the return of a book
//      NOTE: Express uses the : to denote a variable in a route, so id is variable and depends on the row clicked
//        /return represents the endpoint to which the id will be sent, ie: the processor for returning a book
//      executes as a result of cliking on the Return link off of a Book Listing row
//  =========================================================================
// use the id to get thr row (book) being returned
router.get('/:id/return', (req, res, next) => {
    Loan.findOne({
        where: {
            id: req.params.id
        },
        include: [{                     // join to
            model: Book,                // Book
            attributes: [               // bring back
                ['title', 'title']      // the book title
            ]
        }, {                                    // AND join to
            model: Patron,                      // Patron
            attributes: [                       // bring back
                ['first_name', 'first_name'],   // first_name AND
                ['last_name', 'last_name']      // last_name
            ]
        }]
    }).then(loan => {

        const loanedBook = loan.get({
            plain: true
        });

        const title = `Return ${ loanedBook.Book.title }`;

        res.render(
            'return', 
            { 
                today, 
                title, 
                loanedBook 
            }
        );
    });
});

// POST the book return update
router.post('/:id/return', (req, res, next) => {

    Loan.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: Book,
            attributes: [
                ['title', 'title']
            ]
        }, {
            model: Patron,
            attributes: [
                ['first_name', 'first_name'],
                ['last_name', 'last_name']
            ]
        }]
    }).then(loan => {

        const dateMatch = /^\d{4}-\d{2}-\d{2}$/igm;

        const loanedBook = loan.get({
            plain: true
        });

        const title = `Return ${ loanedBook.Book.title }`;
        const errors = [];

        // if you try to save a return with no return date
        if (!req.body.returned_on) {
            errors.push(new Error('Return date cannot be empty'));
        } else if (!dateMatch.test(req.body.returned_on)) {
            errors.push(new Error('You must enter a valid date. ex. 2017-07-08'));
        }
        //  update the return (no errors) and goto loan uri OR retry the return
        if ( errors.length === 0 ) {
            loan.update({
                returned_on: req.body.returned_on
            }).then(() => {
                res.redirect('/loan');
            });
        } else {
            res.render('return', { 
                title, 
                loanedBook, 
                today, 
                errors 
            });
        }
    });
});

//  =========================================================================
//  4. Set Up Book Detail processing
//      executes as a result of clicking on a Book Title on a Book Listing row
//  =========================================================================
router.get('/:id', (req, res, next) => {
    Book.findById(req.params.id).then(book => {
        
        const bookData = book.get({
            plain: true
        });

        res.redirect(
            `/book/${ req.params.id }/${ title }`
        );
    });
});

//  GET row for book detail - from the redirect above
router.get('/:id/:title', (req, res, next) => {
    //  select the one row for the detail
    const bookData = Book.findById(req.params.id);
    // gather loan history information
    const loanData = Loan.findAll({
        where: {
            loaned_on: {
                $not: null
            }
        },
        include: [{                             // join
            model: Patron,                      // to Patron
            attributes: [                       // bring back
                ['first_name', 'first_name'],   // first name
                ['last_name', 'last_name']      // last name
            ]
        }, {                                    // AND
            model: Book,                        // to Book
            where: {
                id: req.params.id               // id = req id
            }
        }]
    });

    Promise.all([
        bookData,
        loanData
    ]).then(data => {

        bookDetail = true;

        const columns = [
            "Book",
            "Patron",
            "Loaned On",
            "Return By",
            "Returned On"
        ];

        const bookRow = data[0].get({
            plain: true
        });

        const loanedBooks = data[1].map(loan => {
            return loan.get({
                plain: true
            });
        });

        const title = `Book: ${ bookRow.title }`;

        res.render('detail_selector', { 
            entity, 
            title, 
            columns, 
            bookRow, 
            loanedBooks, 
            bookDetail 
        });

    }).catch(error => {
        res.status(500).send(error);
    });
});

router.post('/:id/:name', (req, res, next) => {

    const bookData = Book.findById(req.params.id);

    const loanData = Loan.findAll({
        where: {
            loaned_on: {
                $not: null
            }
        },
        include: [{
            model: Patron,
            attributes: [
                ['first_name', 'first_name'],
                ['last_name', 'last_name']
            ]
        }, {
            model: Book,
            where: {
                id: req.params.id
            }
        }]
    });

    Promise.all([
        bookData,
        loanData
    ]).then(data => {

        Book.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            res.redirect('/book');
        }).catch(error => {
            // if there is a validation error then retry
            if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {

                bookDetail = true;

                const bookRow = data[0].get({
                    plain: true
                });

                const loanedBooks = data[1].map(loan => {
                    return loan.get({
                        plain: true
                    });
                });

                const title = `Book: ${ bookRow.title }`;

                const columns = [
                    "Book",
                    "Patron",
                    "Loaned On",
                    "Return By",
                    "Returned On"
                ];

                res.render('detail_selector', { 
                    entity, 
                    title, 
                    columns, 
                    bookRow, 
                    loanedBooks,
                    bookDetail, 
                    errors: error.errors
                });
            } else {
                res.status(500).send(error);
            }
        });
    });
});
//  end of the Book Detail processing
//  =========================================================================

module.exports = router;