const async = require("async");
const usersModel = require("../models").users;
const bcrypt = require("bcrypt");
var request = require("request");
const Op = require("sequelize").Op;
const jwt = require("jsonwebtoken");
const env = "development";
console.log("env: ", env);
const config = require("../config/config.json")[env];
const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mithuzaman2020@gmail.com",
    pass: "smlx bsxs hksp ognj",
  },
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, mobile:user.mobile, email:user.email }, config.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, config.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = {
  // Request OTP
  async requestOTP(req, res) {
    const { mobile, email } = req.body;
    console.log("mobile=", mobile);
    console.log("emai=", email);
    if (!mobile && !email)
      return res
        .status(200)
        .json({ status: false, message: "Email required", otp: "" });

    const contactFilter = mobile ? { mobile } : { email };
    const user = await usersModel.findOne({ where: contactFilter });
    if (!user) {
      return res.status(200).json({
        status: false,
        message:
          "Can not send OTP as the provided email id is not registered with us",
        otp: "",
      });
    } else {
      if (user?.status != "Active") {
        return res.status(200).json({
          status: false,
          message:
            "Can not send OTP as your account has been deactivated. Kindly contact with admin",
          otp: "",
        });
      } else if (user?.isDeleted) {
        return res.status(200).json({
          status: false,
          message:
            "Can not send OTP as your account has been deleted. Kindly contact with admin",
          otp: "",
        });
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await usersModel.update({ otp, otpExpiry }, { where: contactFilter });
        console.log(`OTP sent to ${mobile || email}: ${otp}`);
        
        // Email Template
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; background-color:#f5f6ff; padding:30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff; border-radius:8px; overflow:hidden;">
                    <tr><td align="center" style="padding:30px 20px 10px;">
                      <h2 style="color:#5b3fd4; margin:0;">Celebrate7</h2>
                    </td></tr>
                    <tr><td align="center" style="padding:10px 30px;">
                      <h3 style="color:#5b3fd4; font-size:22px;">2FA code</h3>
                      <p style="color:#333;">Here is your login verification code:</p>
                      <div style="background-color:#e6e1fb; border-radius:6px; padding:10px 20px; display:inline-block;">
                        <p style="font-size:24px; font-weight:bold; color:#5b3fd4; letter-spacing:2px; margin:0;">${otp}</p>
                      </div>
                      <p style="color:#555; font-size:14px; margin-top:20px;">Please make sure you never share this code with anyone.</p>
                      <p style="color:#333; font-size:13px;"><strong>Note:</strong> The code will expire in 5 minutes.</p>
                    </td></tr>
                    <tr><td align="center" style="padding:25px; background-color:#f5f6ff;">
                      <p style="font-size:13px; color:#777;">© 2025 Celebrate7. All rights reserved.</p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            `;
        // Email options
        const mailOptions = {
          from: '"Celebrate7" <mithuzaman2020@gmail.com>',
          to: email,
          subject: "Celebrate7 - Your login verification code",
          text: "2FA code",
          html: htmlTemplate,
        };
        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("❌ Error:", error);
            res.json({
              status: false,
              message: "Something went wrong ! Please try again",
              otp: otp,
            });
          } else {
            console.log("✅ Email sent: " + info.response);
            res.json({
              status: true,
              message: "OTP sent to your registerd email id",
              // otp: otp,
            });
          }
        });
      }
    }
  },

  async verifyOTP(req, res) {
    const { mobile, email, otp } = req.body;
    const filter = mobile ? { mobile } : { email };

    const user = await usersModel.findOne({ where: filter });
    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.otp = null;
    user.otpExpiry = null;
    user.refreshToken = refreshToken;
    await user.save();
    res.json({ accessToken, refreshToken });
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
      const user = await usersModel.findByPk(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(403).json({ message: "Token expired or invalid" });
    }
  },
  //Start: Method to authenticate a user
  authenticate(req, res) {
    const email = req.body.requestObject.email;
    let userObject = {};

    console.log("++++++++++++", userObject);

    return usersModel
      .findOne({
        where: {
          email: email,
          active: "Active",
        },
      })
      .then((userData) => {
        if (!userData) {
          return res.status(200).send({
            status: false,
            message: `Wrong email.`,
            type: `email`,
          });
        } else {
          userData = userData.get();
          userObject.usr = userData;
          console.log("llllllllllllllllllllll", userData);

          // Since rolePrivilegeModel and privilegeModel are removed,
          // directly respond with the user data.
          return res.status(200).send({
            status: true,
            message: userObject,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).send({ status: false, message: error });
      });
  },
  //End

  verifyEmail(req, res) {
    var emailID = req.body.requestObject;

    if (emailID === null || emailID === "") {
      return res.status(400).send({ error: "Something went wrong" });
    }
    return usersModel
      .findOne({
        where: {
          email: emailID,
        },
        attributes: ["email"],
      })
      .then((emailData) => {
        if (!emailData) {
          return res.status(200).send({ message: "notExist" });
        } else {
          return res.status(200).send({ message: "exist" });
        }
        // return res.status(200).send({ message: "exist" });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  },
};
