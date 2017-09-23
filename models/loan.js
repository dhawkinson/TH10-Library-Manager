'use strict';
const moment = require('moment');
const today = moment().subtract(1, 'days').format('YYYY[-]MM[-]DD');

module.exports = function(sequelize, DataTypes) {
    var Loan = sequelize.define('Loan', {
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Book Id is required.'
                }
            }
        },
        patron_id: {
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: {
                    msg: 'Patron Id is required.'
                }
            }
        },
        loaned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Loaned On Date is required.'
                },
                is: {
                    args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                    msg: 'Loaned On Date must be in the correct format. ex. 2017-07-08'
                },
                isDate: {
                    msg: 'Loaned On Date must be in the correct format. ex. 2017-07-08'
                },
                isAfter: {
                    args: today,
                    msg: 'Loaned on Date must be today or in the future.'
                },
                isNotSpecial(value) {
                    const special = /[!@#$%^&*()_+=<>,.'";:`~]+/ig;
                    if (value.match(special)) {
                        throw new Error('Loaned On Date must be in the correct format. ex. 2017-07-08');
                    }
                }
            }
        },
        return_by: {
            type: DataTypes.DATEONLY,
            validate: {
                notEmpty: {
                    msg: 'Return By Date is required.'
                },
                is: {
                    args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                    msg: 'Return By Date must be in the correct format. ex. 2017-07-08'
                },
                not: {
                    args: /[!@#$%^&*()_+=<>,.'";:`~]/ig,
                    msg: 'Return By Date must be in the correct format. ex. 2017-07-08'
                },
                isAfter: {
                    args: today,
                    msg: 'Return By Date must be today or in the future.'
                },
                isDate: {
                    msg: 'Return By Date must be in the correct format. ex. 2017-07-08'
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
