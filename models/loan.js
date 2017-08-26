'use strict';
const moment = require('moment');
const today = moment().subtract(1, 'days').format('YYYY[-]MM[-]DD');

module.exports = function(sequelize, DataTypes) {
        let Loan = sequelize.define('Loan', {
                book_id: {
                        type: DataTypes.INTEGER,
                        validate: {
                                notEmpty: {
                                    msg: 'Book id required!'
                                }
                        }
                },
                patron_id: {
                        type: DataTypes.INTEGER,
                        validate: {
                                notEmpty: {
                                        msg: 'Patron id required!'
                                }
                        }
                },
                loaned_on: {
                        type: DataTypes.DATEONLY,
                        validate: {
                                notEmpty: {
                                        msg: 'Loaned-on date required!'
                                },
                            is: {
                                    args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                                    msg: 'Loaned-on date must be in the format: YYYY-MM-DD!'
                            },
                            isDate: {
                                    msg: 'Loaned-on date must be in the format: YYYY-MM-DD!'
                            },
                            isAfter: {
                                args: today,
                                msg: 'Loaned-on date cannot be earlier than today!'
                            },
                            isNotSpecial(value) {
                                    const special = /[!@#$%^&*()_+=<>,.'";:`~]+/ig;
                                    if (value.match(special)) {
                                            throw new Error('Loaned-on date must be in the format: YYYY-MM-DD!');
                                    }
                            }
                        }
                },
                return_by: {
                        type: DataTypes.DATEONLY,
                        validate: {
                                notEmpty: {
                                        msg: 'Return-by date required!'
                                },
                                is: {
                                        args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                                        msg: 'Return-by date must be in the format: YYYY-MM-DD!'
                                },
                                not: {
                                        args: /[!@#$%^&*()_+=<>,.'";:`~]/ig,
                                        msg: 'Return-by date must be in the format: YYYY-MM-DD!'
                                },
                                isAfter: {
                                        args: today,
                                        msg: 'Loaned-on date cannot be earlier than today!'
                                },
                                isDate: {
                                    msg: 'Loaned-on date must be in the format: YYYY-MM-DD!'
                                }
                        }
                },
                returned_on: {
                        type: DataTypes.DATEONLY
                }
        });
        Loan.associate = function(models) {
            // associations can be defined here
            Loan.belongsTo(models.Book, { foreignKey: "book_id" });
            Loan.belongsTo(models.Patron, { foreignKey: "patron_id" });
        };

        return Loan;
};
