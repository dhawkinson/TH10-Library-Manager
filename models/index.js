'use strict';


const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const env       = process.env.NODE_ENV || 'development';          //  set the environement to 'development'
const config    = require(__dirname + '/../config/config.json')[env]; //  set config params to values in config.json
const db        = {};

// look for environment variables in the default location (config.json)
//      if they are there - use them
//      else specifically set them (this would happen if config.json is replaced by config.js, for example)
if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)     // set to iterate on the current directory
    //  set model filter to look for files with name ending in '.js' but !== basename (index)
    //      in this case they will be book.js/patron.js/loan.js
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    //  import the models
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });
//  validate the the models belong to the databsae
Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

