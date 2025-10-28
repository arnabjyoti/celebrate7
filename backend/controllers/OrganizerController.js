const async = require("async");
const usersModel = require("../models").users;
const organizersModel = require("../models").organizers;
const bcrypt = require("bcrypt");
var request = require("request");
const Op = require("sequelize").Op;

module.exports = {
  //Start: Method to register organizer
  async organizerRegistration(req, res) {
    const requestObject = req.body.requestObject;
    return usersModel
      .findOne({
        where: {
          isDeleted: false,
          [Op.or]: [{ email: requestObject.email }],
        },
      })
      .then((o) => {
        if (o) {
          return res.status(200).send({
            status: false,
            message: `Organizer with the same email is already exist.`,
          });
        } else {
          const newOrganizer = {
            organizer_name: requestObject.organizerName,
            contact_name: requestObject.contactName,
            type_of_organization: requestObject.typeOfOrganizer,
            email: requestObject.email,
            phone: requestObject.mobileNumber,
            country: requestObject.country,
            state: requestObject.state,
            city: requestObject.city,
            status: "Active",
            isDeleted: false,
          };
          organizersModel.create(newOrganizer).then((r) => {
            const newUser = {
              mobile: requestObject.mobileNumber,
              email: requestObject.email,
              role: "admin",
              otp: null,
              otpExpiry: null,
              refreshToken: null,
              status: "Active",
              isDeleted: false,
            };
            usersModel.create(newUser).then((user) => {
              return res.status(200).send({
                status: true,
                message: "Success! Thank you for registering with us",
              });
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
  },
  //End

  //Start: Method to add new or update organizer
  async upsert(req, res) {
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
        .then((organizerData) => {
          if (organizerData) {
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
    } else {
      const { id, name, email, phone, location, status } = organizer;
      const [updated] = await organizersModel.update(
        { name, email, phone, location, status },
        { where: { id } }
      );
      if (updated) {
        const email = organizer.email;
        const mobile = organizer.phone;
        const status = organizer.status;
        const user = await usersModel.findOne({
          where: {
            [Op.or]: [email ? { email } : {}, mobile ? { mobile } : {}],
          },
        });
        user.email = email;
        user.mobile = mobile;
        user.status = status;
        await user.save();
        const updatedOrganizer = await organizersModel.findByPk(id);
        return res.json({
          status: true,
          message: "Organizer record updated successfully",
          category: updatedOrganizer,
        });
      }
    }
  },
  //End

  //Start: Method to view organizers
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
        }else{
          const organizer = await organizersModel.findAll({
          where: { 
            isDeleted: false,
            status: 'Active'
          },
        });
        res.status(200).json({
        status: true,
        message: "Success",
        data: organizer
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
