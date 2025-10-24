"use strict";

module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define("events", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    eventName: DataTypes.TEXT,
    organizer: DataTypes.TEXT,
    type: DataTypes.STRING,
    eventFromDate: DataTypes.STRING,
    eventToDate: DataTypes.STRING,
    eventTime: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    fullAddress: DataTypes.TEXT,
    lat: DataTypes.TEXT,
    lng: DataTypes.TEXT,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: DataTypes.INTEGER,
  });

  Events.associate = function (models) {
    Events.hasMany(models.event_images, {
      foreignKey: "eventId",
      as: "images",
    });
  };

  return Events;
};
