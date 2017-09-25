'use strict';
(function () {      //  use module pattern
	// ... all vars and functions are in this scope only
    // still maintains access to all globals
    module.exports = {
        up: function(queryInterface, Sequelize) {
            return queryInterface.createTable('Patrons', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                first_name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                last_name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                library_id: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                zip_code: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                }
            });
        },
        down: function(queryInterface, Sequelize) {
            return queryInterface.dropTable('Patrons');
        }
    };
}());
