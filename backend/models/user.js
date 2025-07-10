'use strict';

module.exports = (sequelize, type) => {
    const users = sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        f_name: type.STRING,
        m_name: type.STRING,
        l_name: type.STRING,
        email: type.STRING,
        phone_no: type.STRING,
        address: type.STRING,
        password: type.STRING,
        temp_password: type.STRING,
        role: type.STRING,
        active: type.STRING,
        rememberToken: type.STRING,
        createdBy: type.INTEGER,
    }, {});
    users.associate = function(models) {
        // associations can be defined here
    };
    return users;
};