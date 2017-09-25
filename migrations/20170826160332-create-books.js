'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    module.exports = {
        up: function(queryInterface, Sequelize) {
            return queryInterface.createTable('Books', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                author: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                genre: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                first_published: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            });
        },
        down: function(queryInterface, Sequelize) {
            return queryInterface.dropTable('Books');
        }
    };
}());
