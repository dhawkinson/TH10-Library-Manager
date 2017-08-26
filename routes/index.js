const express  = require('express');
const router     = express.Router();

const Book       = require("../models").books;
const Loan       = require("../models").loans;
const Patron    = require("../models").patrons;


/* GET home page. */
router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
});

module.exports = router;
