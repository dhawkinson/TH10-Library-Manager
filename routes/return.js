'use strict';
(function () {      //  use module pattern
	const express = require('express');
    const router = express.Router();

    
    router.get('/', (req, res, next) => {
        res.render('/return');
    });
    
    module.exports = router;

}());
