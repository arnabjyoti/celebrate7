"use strict";

module.exports = (sequelize, type) => {
  const event_booking_details = sequelize.define(
    "event_booking_details",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventId: type.STRING,
      booking_type: type.TEXT,
      booking_description: type.TEXT,
      price: type.STRING,
      capacity: type.STRING,
      booking_start_date: type.STRING,
      booking_end_date: type.STRING,
      isActive: {
        type: type.BOOLEAN,
        defaultValue: true, 
      },
      isDefault: type.BOOLEAN,
      isDeleted: {
        type: type.BOOLEAN,
        defaultValue: false, 
      },
      createdBy: type.INTEGER,
    },
    {}
  );
  event_booking_details.associate = function (models) {
    // associations can be defined here
  };
  return event_booking_details;
};
