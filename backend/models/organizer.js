"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const organizers = sequelize.define('organizers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
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
    tableName: 'organizers',
    timestamps: true
  });

  organizers.associate = function (models) {
    // associations can be defined here
  };
  return organizers;
};
