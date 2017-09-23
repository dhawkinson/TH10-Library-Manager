'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    module.exports = {
        up: function(queryInterface, Sequelize) {
            return queryInterface.createTable('Patrons', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                first_name: {
                    type: Sequelize.STRING
                },
                last_name: {
                    type: Sequelize.STRING
                },
                address: {
                    type: Sequelize.STRING
                },
                email: {
                    type: Sequelize.STRING
                },
                library_id: {
                    type: Sequelize.STRING
                },
                zip_code: {
                    type: Sequelize.INTEGER
                }
            });
        },
        down: function(queryInterface, Sequelize) {
            return queryInterface.dropTable('Patrons');
        }
    };
}());
