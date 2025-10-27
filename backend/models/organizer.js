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
    organizer_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type_of_organization: {
      type: DataTypes.STRING(50),
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
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
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
    organizers.hasMany(models.events, {
      foreignKey: "organizer",
      as: "events",
    });
  };
  return organizers;
};
