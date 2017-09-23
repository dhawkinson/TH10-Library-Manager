'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    module.exports = {
        up: function(queryInterface, Sequelize) {
            return queryInterface.createTable('Loans', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                book_id: {
                    type: Sequelize.INTEGER
                },
                patron_id: {
                    type: Sequelize.INTEGER
                },
                loaned_on: {
                    type: Sequelize.DATE
                },
                return_by: {
                    type: Sequelize.DATE
                },
                returned_on: {
                    type: Sequelize.DATE
                }
            });
        },
        down: function(queryInterface, Sequelize) {
            return queryInterface.dropTable('loans');
        }
    };
}());
