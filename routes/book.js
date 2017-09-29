'use strict';
(function () {
    const express   = require('express');
    const router    = express.Router();
    const moment    = require('moment');

    const today     = moment().format('YYYY[-]MM[-]DD');

    const Book      = require('../models').Book;
    const Loan      = require('../models').Loan;
    const Patron    = require('../models').Patron;

    let entity      = 'book';

    let bookDetail;
    let currPage;
    let filter;
    let search;
    let search_title;
    let genre;
    let author;
    let first_published;
    
    // ==========================================================================
    //  ROUTER STRUCTURE
    //      1. New Book processing
    //      2. Book queries/listings
    //      3. Book detail processing
    //      4. Loaned Book return processing
    // ==========================================================================
    
    //  1. GET response for "new book" request
    //  =========================================================================
    router.get('/new', (req, res, next) => {
        const title = 'New Book';
        res.render('new_selector', { 
            entity,
            title, 
            bookRow: {}
        });
    });
    //  POST a new book
    router.post('/new', (req, res, next) => {
        Book.create(req.body)
        .then(() => {
            res.redirect('/book/new');  //  redirect to the next new book entry
        })
        .catch(error => {
            // if the error is a validation error - retry
            if (error.name === 'SequelizeValidationError') {
                bookDetail = false;
                const book = Book.build(req.body);
                const bookData = book.get({
                    plain: true
                });
                const errors = error.errors;
                res.render('new_selector', { 
                    entity,
                    title,
                    bookRow: bookData,
                    bookDetail,  
                    errors
                });
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
    });

    //
    //  identification of query parameters
    //
    //      BookQuery           = the resuting query and is conditionally built
    //      req.query.page      = a requested page number (may be undefined)
    //      req.query.filter    = the requested lisitng filter (All/Checked Out/Overdue)
    //      req.query.search    = the indicator that a specific search is called for
    //    

    //  2. Set Up the Book Queries (listings)
    //  =========================================================================
    router.get('/', (req, res, next) => {
        // no page selected - so page = 1
        if (req.query.page === undefined && req.query.filter === undefined) {
            res.redirect('/book?page=1');
        }

        let bookQuery;
        //  set search flag to true or false
        search = req.query.search ? req.query.search : false;

        //  a query with no search parameters
        if (req.query.search === undefined) {
            bookQuery = Book.findAndCountAll({
                order: [
                        ['title', 'ASC']
                ],
                limit: 10,
                offset: (req.query.page * 10) - 10,
            });
        }
               
        //  capture search parameters (entry of search parameters)
        router.post('/', (req, res, next) => {

            if (req.query.page === undefined && req.query.filter === undefined) {
                req.query.page = 1;
            }

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
                limit: 10,
                offset: (req.query.page * 10) - 10,
            }).then(books => {
                res.redirect(`/book?page=1&search=true&title=${ req.body.title ? req.body.title : '' }&author=${ req.body.author ? req.body.author : ''}&genre=${ req.body.genre ? req.body.genre : ''}&first_published=${ req.body.first_published ? req.body.first_published : ''}`);
            });
        });

        // query for books with search parameters
        if (req.query.search) {
            bookQuery = Book.findAndCountAll({
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
                limit: 10,
                offset: (req.query.page * 10) - 10,
            });
        }

        //  query for Checked Out books (a filter)
        if (req.query.filter === 'checked_out') {
            bookQuery = Book.findAndCountAll({
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
                limit: 10,
                offset: (req.query.page * 10) - 10
            });
        }
        
        //  query for Overdue books (a filter)
        if (req.query.filter === 'overdue') {
            bookQuery = Book.findAndCountAll({
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
                limit: 10,
                offset: (req.query.page * 10) - 10
            });
        }
 

        // render the book query
        bookQuery
        .then(books => {
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
            //  set search fields
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
                search_title,
                author,
                genre,
                first_published,
                search
            });
        })
        .catch(error => {
            res.status(500).send(error);
        });

        //  3. Set Up book detail processing
        //  =========================================================================
        router.get('/:id', (req, res, next) => {
            // get the book specifics
            Book.findAll({
                where: {
                    id: req.params.id
                },
            }).then(book => {
                res.redirect(
                    `/book/${req.params.id}/${book[0].dataValues.title.replace(/ /g, '_')}`
                );
            }).catch(error => {
                res.status(500).send(error);
            });
        });

        router.get('/:id/:title', (req, res, next) => {
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

                const book = data[0].get({
                    plain: true
                });

                const loanedBooks = data[1].map(loan => {
                    return loan.get({
                        plain: true
                    });
                });

                const title = `Book: ${ book.title }`;

                res.render('detail_selector', { 
                    entity, 
                    title, 
                    columns, 
                    book, 
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
                    if (error.name === "SequelizeValidationError") {

                        bookDetail = true;

                        const bookRow = data[0].get({
                            plain: true
                        });

                        const loanedBooks = data[1].map(loan => {
                            return loan.get({
                                plain: true
                            });
                        });

                        const title = `Book: ${ book.title }`;

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
                        throw error;
                    }
                })
                .catch(error => {
                    res.status(500).send(error);
                });
            });
        });

        //  4. Set Up the return of a book
        //  =========================================================================
        router.get('/:id/return', (req, res, next) => {
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

                const loanedBook = loan.get({
                    plain: true
                });

                const title = `Return ${ loanedBook.Book.title }`;

                res.render('return', { today, title, loanedBook });
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
    });

    module.exports = router;

}());