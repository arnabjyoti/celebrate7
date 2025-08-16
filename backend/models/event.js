"use strict";

module.exports = (sequelize, type) => {
  const events = sequelize.define(
    "events",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventName: type.TEXT,
      organizer: type.TEXT, 
      type: type.STRING,
      eventDate: type.STRING,
      eventTime: type.STRING,
      country: type.STRING,
      state: type.STRING,
      city: type.STRING,
      fullAddress: type.TEXT,

      lat: type.TEXT,
      lng: type.TEXT,

      description: type.TEXT,
      status: type.STRING,
      isDeleted: {
        type: type.BOOLEAN,
        defaultValue: false,
      },
      createdBy: type.INTEGER,
    },
    {}
  );
  events.associate = function (models) {
    // associations can be defined here
  };
  return events;
};
