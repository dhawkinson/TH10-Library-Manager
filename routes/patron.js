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
    let endpoint    = '';
    
    //  GET response for "new patron" request
    router.get('/new', (req, res, next) => {
        endpoint = "new";
        res.render('selector', { entity, patronProperties: {} });
    });
    
    router.post('/new', (req, res, next) => {
        endpoint = "new"
        Patron.create(req.body).then(() => {
            res.redirect('/patron');
        }).catch(error => {
            if (error.name === "SequelizeValidationError") {
                const patron = Patron.build(req.body);
    
                const patronData = patron.get({
                    plain: true
                });
    
                res.render('selector', { patronProperties: patronData, errors: error.errors, title: 'New Patron', entity });
            } else {
                throw error;
            }
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    /*
    //  GET response for "patron detail" updates
    router.get('/:id', (req, res, next) => {
        endpoint = "detail"
        Patron.findById(req.params.id).then(patron => {
    
            const patronData = patron.get({
                plain: true
            });
    
            const patronName = patronData.full_name.split(' ').join('_');
    
            res.redirect(`/patrons/${ req.params.id }/${ patronName }`);
        });
    });
    
    router.get('/:id/:name', (req, res, next) => {
        endpoint = "detail"
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
                "Return On"
            ];
    
            const title = `Patron: ${ patronProperties.full_name }`;
    
            res.render('selector', {
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
        endpoint = "detail"
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
                "Return On"
            ];
    
            const title = `Patron: ${ patronProperties.full_name }`;
    
            Patron.update(req.body, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.redirect('/patrons');
            }).catch(error => {
    
                if (error.name === "SequelizeValidationError") {
    
                    res.render('selector', { patronDetail, columns, patronProperties, title, loanedBooks: patronProperties.Loans, errors: error.errors, entity });
                } else {
                    throw error;
                }
            }).catch(error => {
                res.status(500).send(error);ExtensionScriptApis
            });
        });
    });
    
    //  GET response for "all patrons" listing
    router.get('/list', (req, res, next) => {
        endpoint="list"
        Patron.findAll({
            order: [
                ['last_name', 'ASC'],
                ['first_name', 'ASC']
            ]
        }).then(patrons => {
    
            const colHeads = [
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
    
            res.render('selector', { patronData, columns, title, entity });
        });
    });*/

    module.exports = router;
}());
