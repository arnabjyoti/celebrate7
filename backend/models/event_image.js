"use strict";

module.exports = (sequelize, DataTypes) => {
  const EventImages = sequelize.define("event_images", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER, // should be INTEGER, not STRING
      allowNull: false,
    },
    title: DataTypes.TEXT,
    filename: DataTypes.TEXT,
    path: DataTypes.TEXT,
    originalname: DataTypes.TEXT,
    description: DataTypes.TEXT,
    isDefault: DataTypes.BOOLEAN,
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: DataTypes.INTEGER,
  });

  EventImages.associate = function (models) {
    EventImages.belongsTo(models.events, {
      foreignKey: "eventId",
    });
  };

  return EventImages;
};
