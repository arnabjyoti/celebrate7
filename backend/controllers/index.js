const AuthController = require('./AuthController');
const OrganizerController = require('./OrganizerController');
const sendMail = require('./sendMail');
const eventController = require('./eventController');
module.exports = {
	AuthController,
	OrganizerController,
	sendMail,
	eventController,
};
