const { sendMail} = require('../controllers');

const AuthController = require('../controllers').AuthController;
const OrganizerController = require('../controllers').OrganizerController;

//Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome'
		})
	);

	// Auth API's
	app.post('/api/request-otp', AuthController.requestOTP);

	app.post('/api/verify-otp', AuthController.verifyOTP);

	app.post('/api/refresh-token', AuthController.refreshToken);

	app.post('/api/authenticate', AuthController.authenticate);

	app.post('/api/verifyEmail', AuthController.verifyEmail);

	app.post('/api/sendOtp', sendMail.sendOtp);


	// Organizer API's
	app.post('/api/upsert-organizer', OrganizerController.upsert);
	app.post('/api/get-organizers', OrganizerController.view);
	app.post('/api/delete-organizer', OrganizerController.delete);

	};