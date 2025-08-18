const async = require("async");
const usersModel = require("../models").users;
const organizersModel = require("../models").organizers;
const bcrypt = require("bcrypt");
var request = require("request");
const Op = require("sequelize").Op;

module.exports = {
  //Start: Method to add new or update organizer
  upsert(req, res) {
    const organizer = req.body.organizer;
    if (organizer?.id == 0) {
      return usersModel
        .findOne({
          where: {
            // status: "Active",
            isDeleted: false,
            [Op.or]: [{ email: organizer.email }, { mobile: organizer.phone }],
          },
        })
        .then((userData) => {
          if (userData) {
            return res.status(200).send({
              status: false,
              message: `Organizer with the same phone or email is already exist.`,
            });
          } else {
            organizersModel.create(organizer).then((r) => {
              const newUser = {
                mobile: organizer.phone,
                email: organizer.email,
                role: "admin",
                otp: null,
                otpExpiry: null,
                refreshToken: null,
                status: organizer.status,
                isDeleted: false,
              };
              usersModel.create(newUser).then((user) => {
                return res.status(200).send({
                  status: true,
                  message: "New organizer added successfully",
                });
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({ status: false, message: error });
        });
    }else{
      return res.status(200).send({
                status: true,
                message: "Organizer record updated successfully",
              });
      return usersModel
      .findOne({
        where: {
          id: organizer?.id
        },
      })
      .then((userData) => {
        if (userData) {
          organizersModel.create(organizer).then((r) => {
            const newUser = {
              mobile: organizer.phone,
              email: organizer.email,
              role: "admin",
              otp: null,
              otpExpiry: null,
              refreshToken: null,
              status: organizer.status,
              isDeleted: false,
            };
            usersModel.create(newUser).then((user) => {
              return res.status(200).send({
                status: true,
                message: "New organizer added successfully",
              });
            });
          });
        } else {
          return res.status(200).send({
            status: false,
            message: `Organizer record not found in the database.`,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
    }
  },
  //End

  //Start: Method to add view organizers
  async view(req, res) {
    try {
      const requestObject = req.body.requestObject;
      const page = requestObject?.currentPage;
      const limit = requestObject?.pageSize;
      const search = requestObject?.searchText;
      const location = requestObject?.location;
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

      // Filter by status if provided
      if (location) {
        whereClause.location = location;
      }

      if (status) {
        whereClause.status = status;
      }

      // Fetch paginated data
      const { count, rows } = await organizersModel.findAndCountAll({
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
