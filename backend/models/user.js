"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  users.associate = function (models) {
    // associations can be defined here
  };
  return users;
};
