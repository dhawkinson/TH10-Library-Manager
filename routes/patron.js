'use strict';
(function () {
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    const express   = require('express');
    const router    = express.Router();
    const Patron    = require('../models').Patron;
    const Loan      = require('../models').Loan;
    const Book      = require('../models').Book;
    
    debugger;

    let entity      = 'patron';
    
    //  GET response for "new patron" request
    router.get('/new', (req, res, next) => {
        const title = 'New Patron';
        res.render('new_selector', { title, patronProperties: {}, entity });
    });
    
    router.post('/new', (req, res, next) => {
        Patron.create(req.body).then(() => {
            res.redirect('/patron');
        }).catch(error => {
            if (error.name === "SequelizeValidationError") {
                const patron = Patron.build(req.body);
                const patronData = patron.get({
                    plain: true
                });
    
                res.render('new_selector', { patronProperties: patronData, errors: error.errors, title: 'New Patron', entity });
            } else {
                throw error;
            }
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    //  GET response for "all patrons" listing
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
    
            const title  = 'Patrons - All';
    
            res.render('list_selector', { patronData, columns, title, entity });
        });
    });

    //  GET response for "patron detail" updates
    router.get('/:id', (req, res, next) => {
        Patron.findById(req.params.id).then(patron => {
    
            const patronData = patron.get({
                plain: true
            });
    
            const patronName = patronData.full_name.split(' ').join('_');
    
            res.redirect(`/patron/${ req.params.id }/${ patronName }`);
        });
    });
    
    router.get('/:id/:name', (req, res, next) => {
        Patron.findOne({
            where: [{
                id: req.params.id
            }],
            include: [{
                model: Loan,
                include: Book
            }]
        }).then(patron => {
            const patronProperties = patron.get({
                plain: true
            });
    
            for (let loan of patronProperties.Loans) {
                loan.Patron = {};
                loan.Patron.full_name = patronProperties.full_name;
            }
    
            const patronDetail = true;
    
            const columns = [
                "Book",
                "Patron",
                "Loaned On",
                "Return By",
                "Returned On"
            ];
    
            const title = `Patron: ${ patronProperties.full_name }`;
    
            res.render('detail_selector', {
                patronDetail,
                patronProperties,
                entity,
                title,
                columns,
                loanedBooks: patronProperties.Loans
            });
    
        }).catch(err => {
            console.log(err);
        });
    });
    
    router.post('/:id/:name', (req, res, next) => {
        Patron.findOne({
            where: [{
                id: req.params.id
            }],
            include: [{
                model: Loan,
                include: Book
            }]
        }).then(patron => {
    
            const patronProperties = patron.get({
                plain: true
            });
    
            for (let loan of patronProperties.Loans) {
                loan.Patron = {};
                loan.Patron.full_name = patronProperties.full_name;
            }
    
            const patronDetail = true;
    
            const columns = [
                "Book",
                "Patron",
                "Loaned On",
                "Return By",
                "Returned On"
            ];
    
            const title = `Patron: ${ patronProperties.full_name }`;
    
            Patron.update(req.body, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.redirect('/patron');
            }).catch(error => {
    
                if (error.name === "SequelizeValidationError") {
    
                    res.render('detail_selector', { patronDetail, columns, patronProperties, title, loanedBooks: patronProperties.Loans, errors: error.errors, entity });
                } else {
                    throw error;
                }
            }).catch(error => {
                res.status(500).send(error);ExtensionScriptApis
            });
        });
    });
    
    module.exports = router;
}());
