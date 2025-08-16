"use strict";
const usersModel = require("../models").users;
const eventModel = require("../models").events;
const ticketModel = require("../models").tickets;
const eventImageModel = require("../models").event_images;
const request = require("request");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

module.exports = {
  async saveEvent(req, res) {
    try {
      const eventData = req.body.data; // assuming eventData is an object like { eventName: "Test", date: "...", etc. }

      if (!eventData) {
        return res.status(400).send({ message: "No event data provided" });
      }
      eventData.createdBy = "user1";
      console.log("eventData", eventData);
      // Save to DB
      const createdEvent = await eventModel.create(eventData);

      return res.status(201).send({
        message: "Event saved successfully",
        event: createdEvent,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      return res.status(500).send({
        message: "Failed to save event",
        error: error.message,
      });
    }
  },

  async saveTicket(req, res) {
    try {
      const eventData = req.body.data; // assuming eventData is an object like { eventName: "Test", date: "...", etc. }

      if (!eventData) {
        return res.status(400).send({ message: "No event data provided" });
      }
      eventData.createdBy = "user1";
      console.log("ticket", eventData);
      // Save to DB
      const createdEvent = await ticketModel.create(eventData);

      return res.status(201).send({
        message: "Ticket saved successfully",
        event: createdEvent,
      });
    } catch (error) {
      console.error("Error saving ticket:", error);
      return res.status(500).send({
        message: "Failed to save ticket",
        error: error.message,
      });
    }
  },

  async saveEventImg(req, res) {
    console.log("here inside saveEventImg");
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const fileData = {
        eventId: req.body.eventId,
        title: req.body.title || "",
        filename: req.file.filename,
        path: req.file.path, // optional: remove if you don’t want to expose
        originalname: req.file.originalname,
        description: req.body.description || "",
        isDefault: req.body.isDefault === "true",
      };

      console.log("fileData", fileData);

      const createdFile = await eventImageModel.create(fileData);

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        data: createdFile,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res
        .status(500)
        .json({ success: false, message: "Upload failed", error: err.message });
    }
  },

  getAllEvents(req, res) {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 50;
    const offset = (page - 1) * limit;

    const search = req.body.search || ""; // search value from query
    console.log("searchByEventName===>>>> ", search.searchByEventName);
    console.log("searchByOrganizer===>>>> ", search.searchByOrganizer);
    console.log("searchByCity===>>>> ", search.searchByCity);
    const orConditions = [];

    if (search.searchByEventName) {
      orConditions.push({
        eventName: { [Op.like]: `%${search.searchByEventName}%` },
      });
    }

    if (search.searchByOrganizer) {
      orConditions.push({
        organizer: { [Op.like]: `%${search.searchByOrganizer}%` },
      });
    }

    if (search.searchByCity) {
      orConditions.push({ city: { [Op.like]: `%${search.searchByCity}%` } });
    }
    if (search.searchByDate) {
      orConditions.push({
        eventDate: { [Op.like]: `%${search.searchByDate}%` },
      });
    }

    const whereClause =
      orConditions.length > 0 ? { [Op.or]: orConditions } : {};

    eventModel
      .findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      })
      .then((result) => {
        const totalPages = Math.ceil(result.count / limit);
        res.status(200).json({
          success: true,
          data: result.rows,
          pagination: {
            totalItems: result.count,
            totalPages,
            currentPage: page,
            perPage: limit,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json({
          success: false,
          message: "Error fetching events",
          error,
        });
      });
  },

  async getEventDetails(req, res) {
    console.log("req.params.id", req.query.id);
    let query = {
      raw: true,
      order: [["id", "DESC"]],
      where: {
        id: req.query.id,
      },
    };

    const event = await eventModel.findOne(query);
    const eventImages = await eventImageModel.findAll({
      where: {
        eventId: req.query.id,
      },
    });
    const ticket_details = await ticketModel.findAll({
      where: {
        eventId: req.query.id,
      },
    });

    return res.status(200).send({ event, eventImages, ticket_details });
  },

  async updateEvent(req, res) {
    try {
      const eventData = req.body.data;

      if (!eventData || !eventData.id) {
        return res.status(400).send({ message: "Missing event ID or data" });
      }

      const eventId = eventData.id;

      // Check if the event exists
      const existingEvent = await eventModel.findByPk(eventId);
      if (!existingEvent) {
        return res.status(404).send({ message: "Event not found" });
      }

      // Update the event
      await existingEvent.update(eventData);

      return res.status(200).send({
        message: "Event updated successfully",
        event: existingEvent,
      });
    } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).send({
        message: "Failed to update event",
        error: error.message,
      });
    }
  },

  async activeEvent(req, res) {
    const eventId = req.body.eventId;
  
    try {
      // 1. Get current value of isActive
      const event = await eventModel.findByPk(eventId);
  
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
  
      // 2. Toggle isActive
      const newStatus = event.status === 'active'  ? 'draft' : 'active';
  
      // 3. Update the value
      await event.update({ status: newStatus });
  
      // 4. Respond
      res.status(200).json({
        success: true,
        message: `Event is now ${newStatus ? 'active' : 'inactive'}`,
        isActive: newStatus,
      });
    } catch (error) {
      console.error('Error toggling event status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error,
      });
    }
  }
  
};
