"use strict";
const usersModel = require("../models").users;
const eventModel = require("../models").events;
const eventCategoriesModel = require("../models").eventcategories;
const organizersModel = require("../models").organizers;
const ticketModel = require("../models").tickets;
const eventImageModel = require("../models").event_images;
const request = require("request");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const asyncLib = require("async");
const { Stats } = require("fs");
var Sequelize = require("sequelize");

module.exports = {
  //Start: Method to view event categories
  async viewEventCategories(req, res) {
    try {
      const requestObject = req.body.requestObject;
      const page = requestObject?.currentPage;
      const limit = requestObject?.pageSize;
      const search = requestObject?.searchText;
      const status = requestObject?.status;

      const offset = (page - 1) * limit;
      let whereClause = { isDeleted: false };

      // Search in name/email/phone
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      // Fetch paginated data
      const { count, rows } = await eventCategoriesModel.findAndCountAll({
        where: whereClause,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["id", "DESC"]], // latest first
      });

      res.status(200).json({
        status: true,
        message: "Success",
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching event categories:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch event categories",
      });
    }
  },
  //End

  //Start: Method to view event categories
  async getEventCategories(req, res) {
    try {
      const requestObject = req.body;
      const rows = await eventCategoriesModel.findAll({
        where: {
          isDeleted: false,
          status: "Active",
        },
      });
      res.status(200).json({
        status: true,
        message: "Success",
        data: rows,
      });
    } catch (error) {
      console.error("Error fetching event categories:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch event categories",
        data: [],
      });
    }
  },
  //End

  async upsertEventCategory(req, res) {
    try {
      const eventCategoriesData = req.body.category;
      const { id, categoryName, status } = eventCategoriesData;
      if (!eventCategoriesData) {
        return res.status(400).send({
          status: false,
          message: "No event categories data provided",
        });
      } else {
        if (eventCategoriesData?.id == 0) {
          return eventCategoriesModel
            .findOne({
              where: {
                categoryName,
                isDeleted: false,
              },
            })
            .then(async (category) => {
              if (category) {
                return res.status(200).send({
                  status: false,
                  message: `Category with the same name is already exist.`,
                });
              } else {
                const newCategory = await eventCategoriesModel.create(
                  eventCategoriesData
                );
                return res.status(200).send({
                  status: true,
                  message: "Event category created successfully",
                  category: newCategory,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              return res.status(500).send({ status: false, message: error });
            });
        } else {
          const [updated] = await eventCategoriesModel.update(
            { categoryName, status },
            { where: { id } }
          );
          if (updated) {
            const updatedCategory = await eventCategoriesModel.findByPk(id);
            return res.json({
              status: true,
              message: "Event category updated successfully",
              category: updatedCategory,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error saving event category:", error);
      return res.status(500).send({
        status: false,
        message: "Failed to save event category",
        error: error.message,
      });
    }
  },
  //Start: Method to delete organizer
  async deleteEventCategory(req, res) {
    const data = req.body.category;
    try {
      const id = data.id;
      const eventCategory = await eventCategoriesModel.findByPk(id);
      if (!eventCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Event category not found" });
      }
      eventCategory.isDeleted = true;
      await eventCategory.save();
      return res.status(200).send({
        status: true,
        message: "Event category deleted successfully",
      });
    } catch (error) {
      console.error("Error updating organizer:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },
  //End

  async saveEvent(req, res) {
    try {
      const eventData = req.body.data; // assuming eventData is an object like { eventName: "Test", date: "...", etc. }

      if (!eventData) {
        return res.status(400).send({ message: "No event data provided" });
      }
      eventData.createdBy = eventData?.organizer;
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
      eventData.createdBy = eventData?.organizer;
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

  async getAllEvents(req, res) {
    try {
      const page = parseInt(req.body.page) || 1;
      const requestType = req.body.requestType;
      const limit = parseInt(req.body.limit) || 50;
      const offset = (page - 1) * limit;

      const search = req.body.filters || {};

      const orConditions = [];
      const whereClause = { isDeleted: false };
      // Country filter
      if (search.country) {
        whereClause.country = { [Op.like]: `%${search.country}%` };
      }

      // State filter ONLY if country is selected
      if (search.country && search.state) {
        whereClause.state = { [Op.like]: `%${search.state}%` };
      }

      // City filter ONLY if country and state are selected
      if (search.country && search.state && search.city) {
        whereClause.city = Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("city")),
          { [Op.like]: `%${search.city.toLowerCase()}%` }
        );
      }

      // Date range filter
      if (search.fromDate && search.toDate) {
        whereClause[Op.or] = [
          { eventFromDate: { [Op.between]: [search.fromDate, search.toDate] } },
          { eventToDate: { [Op.between]: [search.fromDate, search.toDate] } },
        ];
        console.log(
          "✅ Date range filter applied:",
          search.fromDate,
          "to",
          search.toDate
        );
      }

      console.log("Final WHERE clause:", JSON.stringify(whereClause, null, 2));

      const today = new Date();
      today.setHours(0, 0, 0, 0); // ignore time, just date

      if (search.month) {
        // Month filter (e.g., 'July')
        const monthIndex = new Date(`${search.month} 1, 2000`).getMonth(); // 0-based month
        whereClause[Op.and] = whereClause[Op.and] || [];

        whereClause[Op.and].push(
          Sequelize.where(
            Sequelize.fn("MONTH", Sequelize.col("eventFromDate")),
            monthIndex + 1 // MySQL MONTH() returns 1-12
          )
        );
      }

      if (search.fromDate && !search.toDate) {
        // FromDate only (events starting from this date)
        const from = new Date(search.fromDate);
        if (from < today) from.setTime(today.getTime()); // no past dates
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({ eventFromDate: { [Op.gte]: from } });
      }

      if (search.fromDate && search.toDate) {
        // From-to range
        const from = new Date(search.fromDate);
        const to = new Date(search.toDate);
        if (from < today) from.setTime(today.getTime()); // no past dates
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({
          [Op.or]: [
            { eventFromDate: { [Op.between]: [from, to] } },
            { eventToDate: { [Op.between]: [from, to] } },
          ],
        });
      }

      // today, tomorrow, this weekend search
      today.setHours(0, 0, 0, 0); // start of today

      if (search.date) {
        let start = new Date(today);
        let end = new Date(today);

        switch (search.date.toLowerCase()) {
          case "today":
            end.setDate(end.getDate() + 1);
            break;

          case "tomorrow":
            start.setDate(start.getDate() + 1);
            end.setDate(end.getDate() + 2);
            break;

          case "thisweek":
            const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

            // Start of this week (Monday)
            start = new Date(today);
            const daysSinceMonday = (dayOfWeek + 6) % 7; // converts Sunday=6, Monday=0, etc.
            start.setDate(today.getDate() - daysSinceMonday);
            start.setHours(0, 0, 0, 0);

            // End of this week (next Monday)
            end = new Date(start);
            end.setDate(start.getDate() + 7);
            end.setHours(0, 0, 0, 0);
            break;

          default:
            return; // unknown filter, do nothing
        }

        // Now add single date filter
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({
          eventFromDate: { [Op.gte]: start, [Op.lt]: end },
        });
      }

      console.log("today==========", today);

      // category/type search

      if (search.category) {
        // Convert to number if your DB stores categoryId as integer
        const categoryId = parseInt(search.category);
        if (!isNaN(categoryId)) {
          whereClause.type = categoryId;
        }
      }

      // After handling all date filters (fromDate/toDate, today/tomorrow/thisweekend)
      today.setHours(0, 0, 0, 0); // start of today

      // Apply default "today onward" filter if no date filters provided
      if (!search.date && !search.fromDate && !search.toDate) {
        whereClause[Op.and] = whereClause[Op.and] || [];
        whereClause[Op.and].push({
          eventToDate: { [Op.gte]: today }, // events ending today or later
        });
      }

      if (requestType && requestType == "Public") {
         whereClause[Op.and].push({
          isDeleted: false, // events ending today or later
        },{
          status: "active"
        });
      } else {
        whereClause[Op.and].push({
          isDeleted: false, // events ending today or later
        });
      }

      // Query events
      const result = await eventModel.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: organizersModel,
            as: "organizerDetails",
            attributes: [
              "id",
              "organizer_name",
              "email",
              "phone",
              "country",
              "state",
              "city",
            ],
          },
          {
            model: eventCategoriesModel,
            as: "categoryDetails",
            attributes: ["id", "categoryName", "status"],
          },
          {
            model: eventImageModel,
            as: "images",
            attributes: ["id", "filename", "path", "originalname", "isDefault"],
            where: { isDeleted: false },
            required: false,
          },
        ],
      });

      // Log matched city/event
      console.log(
        "Matched city/event names:",
        result.rows.map((r) => `${r.city} - ${r.eventName}`)
      );

      const totalPages = Math.ceil(result.count / limit);

      return res.status(200).json({
        success: true,
        data: result.rows,
        pagination: {
          totalItems: result.count,
          totalPages,
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(400).json({
        success: false,
        message: "Error fetching events",
        error,
      });
    }
  },

  getEventsByOrganizer(req, res) {
    try {
      const email = req.body.email || "";
      const page = parseInt(req.body.page) || 1;
      const limit = parseInt(req.body.limit) || 50;
      const offset = (page - 1) * limit;

      asyncLib.waterfall(
        [
          // Step 1
          function (callback) {
            (async () => {
              let response = {
                status: true,
                data: null,
                message: "No organizer found",
              };
              if (email) {
                const organizer = await organizersModel.findOne({
                  where: {
                    email: email,
                    isDeleted: false,
                    status: "Active",
                  },
                });
                response = {
                  status: true,
                  data: organizer,
                  message: "Organizer found",
                };
              }
              callback(null, response);
            })();
          },

          // Step 2
          function (organizer, callback) {
            (async () => {
              try {
                let response = {
                  status: false,
                  data: [],
                  pagination: null,
                  message: "No event found",
                };
                if (organizer?.status && organizer?.data?.id) {
                  const search = req.body.filters || {};
                  const orConditions = [];

                  if (search.state) {
                    orConditions.push({
                      state: { [Op.like]: `%${search.state}%` },
                    });
                  }

                  if (search.fromDate && search.toDate) {
                    orConditions.push({
                      [Op.or]: [
                        {
                          eventFromDate: {
                            [Op.between]: [search.fromDate, search.toDate],
                          },
                        },
                        {
                          eventToDate: {
                            [Op.between]: [search.fromDate, search.toDate],
                          },
                        },
                      ],
                    });
                  }

                  const whereClause =
                    orConditions.length > 0
                      ? {
                          [Op.and]: [
                            {
                              isDeleted: false,
                              organizer: organizer?.data?.id,
                            },
                            { [Op.or]: orConditions },
                          ],
                        }
                      : { isDeleted: false, organizer: organizer?.data?.id };

                  const events = await eventModel.findAndCountAll({
                    where: whereClause,
                    offset,
                    limit,
                    order: [["createdAt", "DESC"]],
                    include: [
                      {
                        model: eventImageModel,
                        as: "images",
                        attributes: [
                          "id",
                          "filename",
                          "path",
                          "originalname",
                          "isDefault",
                        ],
                        where: { isDeleted: false },
                        required: false,
                      },
                    ],
                  });

                  const totalPages = Math.ceil(events.count / limit);
                  response = {
                    status: true,
                    data: events.rows,
                    pagination: {
                      totalItems: events.count,
                      totalPages,
                      currentPage: page,
                      perPage: limit,
                    },
                    message: "Events found",
                  };
                }

                callback(null, response);
              } catch (err) {
                callback(err);
              }
            })();
          },
        ],
        function (err, result) {
          if (err) {
            console.error("Error===>", err);
            return res.status(400).json({
              success: false,
              message: "Error fetching events",
              data: err,
            });
          } else {
            return res.status(200).json({
              status: result.status,
              data: result.data,
              pagination: result.pagination,
              message: result.message,
            });
          }
        }
      );
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(400).json({
        success: false,
        message: "Error fetching events",
        error,
      });
    }
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
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      // 2. Toggle isActive
      const newStatus = event.status === "active" ? "draft" : "active";

      // 3. Update the value
      await event.update({ status: newStatus });

      // 4. Respond
      res.status(200).json({
        success: true,
        message: `Event is now ${newStatus ? "active" : "inactive"}`,
        isActive: newStatus,
      });
    } catch (error) {
      console.error("Error toggling event status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error,
      });
    }
  },



  async getCounts (req, res) {
    try {
      const totalEvents = await eventModel.count({ where: { isDeleted: false } });
      const upcomingEvents = await eventModel.count({
        where: {
          isDeleted: false,
          eventToDate: {
            [Op.gte]: new Date(), // greater than or equal to current date
          },
        },
      });
      const pastEvents = await eventModel.count({
        where: {
          isDeleted: false,
          eventToDate: {
            [Op.lt]: new Date(), // less than current date
          },
        },
      });

      const activeEvents = await eventModel.count({
        where: {
          isDeleted: false,
          status: "active"
        },
      });

      const recentEvents = await eventModel.findAll({
        where: {
          isDeleted: false,
        },
        order: [["createdAt", "DESC"]],
        limit: 5,
      });
      

      res.status(200).json({ totalEvents, upcomingEvents, pastEvents, activeEvents, recentEvents });
    } catch (error) {
      console.error("Error fetching event counts:", error);
      res.status(500).json({ message: "Error fetching event counts" });
    }
  },
};
