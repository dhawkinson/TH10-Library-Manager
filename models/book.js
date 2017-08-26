'use strict';
module.exports = function(sequelize, DataTypes) {
        let Book = sequelize.define('Book', {
                title: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                                notEmpty: {
                                        msg: 'Book title required!'
                                },
                        }
                },
                genre: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                                notEmpty: {
                                        msg: 'Genre required!'
                                },
                        }
                },
                author: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                                notEmpty: {
                                    msg: 'Author required!'
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
                                    msg: 'First-published year must be in the format: YYYY'
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