"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const eventcategories = sequelize.define('eventcategories', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING(255),
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
    tableName: 'eventcategories',
    timestamps: true
  });

  eventcategories.associate = function (models) {
    // associations can be defined here
    eventcategories.hasMany(models.events, {
      foreignKey: "type",
      as: "events",
    });
  };
  return eventcategories;
};
