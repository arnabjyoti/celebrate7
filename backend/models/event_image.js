"use strict";

module.exports = (sequelize, type) => {
  const event_images = sequelize.define(
    "event_images",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventId: type.STRING,
      title: type.TEXT,
      filename: type.TEXT,
      path: type.TEXT,
      originalname: type.TEXT,
      description: type.TEXT,
      isDefault: type.BOOLEAN,
      isDeleted: {
        type: type.BOOLEAN,
        defaultValue: false, 
      },
      createdBy: type.INTEGER,
    },
    {}
  );
  event_images.associate = function (models) {
    // associations can be defined here
  };
  return event_images;
};
