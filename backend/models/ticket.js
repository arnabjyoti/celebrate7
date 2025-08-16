"use strict";

module.exports = (sequelize, type) => {
  const tickets = sequelize.define(
    "tickets",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      eventId: type.STRING,
      ticket_type: type.TEXT, 

      ticket_name: type.TEXT,
      ticket_description: type.TEXT,
      no_of_tickets: type.STRING,
      ticket_price: type.STRING,

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
  tickets.associate = function (models) {
    // associations can be defined here
  };
  return tickets;
};
