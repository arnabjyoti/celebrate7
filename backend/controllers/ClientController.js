const async = require("async");
const contactUsModel = require("../models").contact_us;
const Op = require("sequelize").Op;

module.exports = {
  //Start: Method to register organizer
  async saveClientQuery(req, res) {
    try {
      const requestObject = req.body.contactForm;
      const newQuery = {
        name: requestObject.name,
        email: requestObject.email,
        subject: requestObject.subject,
        message: requestObject.message,
        status: "Active",
        isDeleted: false,
      };
      contactUsModel.create(newQuery).then((r) => {
        return res.status(200).send({
          status: true,
          message: "Thank you for reaching out! We’ll get back to you soon.",
        });
      });
    } catch (error) {
      console.error("Error saving query:", error);
      res.status(500).json({
        status: false,
        message: "Failed to save client's query",
      });
    }
  },
  //End

  //Start: Method to get all queries
  async getAllQueries(req, res) {
    try {
      const requestObject = req.body.requestObject;
      const page = requestObject?.currentPage;
      const limit = requestObject?.pageSize;
      const search = requestObject?.searchText;

      const offset = (page - 1) * limit;
      let whereClause = { isDeleted: false };

      // Search in name/email
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      // Fetch paginated data
      const { count, rows } = await contactUsModel.findAndCountAll({
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
      console.error("Error fetching organizers:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch organizers",
      });
    }
  },
  //End

  //Start: Method to view organizers
  async getOrganizerByEmail(req, res) {
    try {
      const requestObject = req.body;
      const role = requestObject?.role;
      const email = requestObject?.email;
      if (email) {
        if (role.toUpperCase() == "ADMIN") {
          const organizer = await organizersModel.findAll({
            where: {
              email: email,
              isDeleted: false,
              status: "Active",
            },
          });
          res.status(200).json({
            status: true,
            message: "Success",
            data: organizer,
          });
        } else {
          const organizer = await organizersModel.findAll({
            where: {
              isDeleted: false,
              status: "Active",
            },
          });
          res.status(200).json({
            status: true,
            message: "Success",
            data: organizer,
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Organizer email id is missing in request payload",
          data: [],
        });
      }
    } catch (error) {
      console.error("Error fetching organizers:", error);
      res.status(500).json({
        status: false,
        message: "Failed to fetch organizers",
      });
    }
  },
  //End

  //Start: Method to delete organizer
  async delete(req, res) {
    const data = req.body.organizer;
    try {
      const id = data.id;
      const organizer = await organizersModel.findByPk(id);
      if (!organizer) {
        return res
          .status(404)
          .json({ status: false, message: "Organizer not found" });
      }
      organizer.isDeleted = true;

      await organizer.save();

      const email = data.email;
      const mobile = data.phone;
      const user = await usersModel.findOne({
        where: {
          [Op.or]: [email ? { email } : {}, mobile ? { mobile } : {}],
        },
      });

      user.isDeleted = true;
      await user.save();
      return res.status(200).send({
        status: true,
        message: "Organizer deleted successfully",
      });
    } catch (error) {
      console.error("Error updating organizer:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },
  //End
};
