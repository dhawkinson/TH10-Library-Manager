'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('books', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull:false
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
        return queryInterface.dropTable('books');
    }
};

