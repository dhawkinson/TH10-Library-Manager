'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    module.exports = {
        up: function(queryInterface, Sequelize) {
            return queryInterface.createTable('Loans', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                book_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                patron_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                loaned_on: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                return_by: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                returned_on: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            });
        },
        down: function(queryInterface, Sequelize) {
            return queryInterface.dropTable('loans');
        }
    };
}());
