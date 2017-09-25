'use strict';
const moment    = require('moment');
const yesterday = moment().subtract(1, 'days').format('YYYY[-]MM[-]DD');

module.exports = function(sequelize, DataTypes) {
    var Loan = sequelize.define('Loan', {
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                isNotNull: {
                    msg: 'Book Id is required.'
                }
            }
        },
        patron_id: {
            type: DataTypes.INTEGER,
            validate: {
                isNotNull: {
                    msg: 'Patron Id is required.'
                }
            }
        },
        loaned_on: {
            type: DataTypes.DATEONLY,
            validate: {
                isNotNull: {
                    msg: 'Loaned On Date is required.'
                },
                is: {
                    args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                    msg: 'Loaned On Date must be in the format; YYYY-MM-DD'
                },
                isDate: {
                    msg: 'Loaned On Date must be a valid date in the format; YYYY-MM-DD'
                },
                isAfter: {
                    args: yesterday,
                    msg: 'Loaned On Date must be later than yesterday.'
                },
                isNotSpecial(value) {
                    const special = /[!@#$%^&*()_+=<>,.'";:`~]+/ig;
                    if (value.match(special)) {
                        throw new Error('Loaned On Date must NOT contain special characters');
                    }
                }
            }
        },
        return_by: {
            type: DataTypes.DATEONLY,
            validate: {
                isNotNull: {
                    msg: 'Return By Date is required.'
                },
                is: {
                    args: /^(\d{4})-((02-(0[1-9]|[12]\d))|((0[469]|11)-(0[1-9]|[12]\d|30))|((0[13578]|1[02])-(0[1-9]|[12]\d|3[01])))$/ig,
                    msg: 'Return By Date must be in the format; YYYY-MM-DD'
                },
                not: {
                    args: /[!@#$%^&*()_+=<>,.'";:`~]/ig,
                    msg: 'Return By Date must be a valid date in the format; YYYY-MM-DD'
                },
                isAfter: {
                    args: loaned_on.add(6,'days').format('YYYY[-]MM[-]DD'),
                    msg: 'Return By Date must be at least a week after Loaned By Date'
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
