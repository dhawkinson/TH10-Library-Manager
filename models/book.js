'use strict';
module.exports = function(sequelize, DataTypes) {
    var Book = sequelize.define('Book', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Book Title is required.'
                },
            }
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Genre is required.'
                },
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Author is required'
                },
            }
        },
        first_published: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            validate: {
                not: {
                    args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
                    msg: 'Year First Published must be numeric in the format: ex. 1999'
                }
            }
        }
    });
    Book.associate = function(models) {
        // associations can be defined here
        Book.hasMany(models.Loan, { foreignKey: "book_id" });
    };
    return Book;
};