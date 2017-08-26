'use strict';
module.exports = function(sequelize, DataTypes) {
        var Patron = sequelize.define('Patron', {
                first_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                            notEmpty: {
                                    msg: 'Patron first name is required!'
                            }
                    }
            },
            last_name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                            notEmpty: {
                                msg: 'Patron last name is required!'
                            }
                    }
            },
            address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                            notEmpty: {
                                msg: 'Patron address  is required!'
                            }
                    }
            },
            email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                            notEmpty: {
                                    msg: 'Patron email address is required!'
                            },
                            isEmail: {
                                msg: 'Patron email must be formatted like example: userid@domain.com'
                            }
                    }
            },
            library_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                            notEmpty: {
                                    msg: 'The library id is required!'
                            }
                    }
            },
            zip_code: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                            not: {
                                    args: /[a-zA-Z!@#$%\^&*()_+=[\]{}:;'".,/\\?`~\-<>]/gim,
                                    msg: 'Patron zip code must be formatted like example: 99999'
                            },
                            notEmpty: {
                                msg: 'Patron zip code is required!'
                            }
                    }
            }
        }, {
            getterMethods: {
                    full_name() {
                            return `${ this.first_name } ${ this.last_name }`;
                    }
            },
            setterMethods: {
                    full_name(full_name) {
                            let split = full_name.split('');
                            this.first_name = split[0];
                            this.last_name = split[1];
                    }
            }
        });
        Patron.associate = function(models) {
                // associations can be defined here
                Patron.hasMany(models.Loan, { foreignKey: 'patron_id' });
        };
        return Patron;
};