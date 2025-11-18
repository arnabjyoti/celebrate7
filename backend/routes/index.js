const { sendMail, eventController} = require('../controllers');

const AuthController = require('../controllers').AuthController;
const OrganizerController = require('../controllers').OrganizerController;

const upload = require('../middlewares/multer');
//Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome'
		})
	);

	// Auth API's
	app.post('/api/request-otp', AuthController.requestOTP);
	app.post('/api/user', AuthController.getUser);

	app.post('/api/verify-otp', AuthController.verifyOTP);

	app.post('/api/refresh-token', AuthController.refreshToken);

	app.post('/api/authenticate', AuthController.authenticate);
	app.post('/api/verifyEmail', AuthController.verifyEmail);
	app.post('/api/sendOtp', sendMail.sendOtp);
	app.post('/api/saveEvent', eventController.saveEvent);
	app.post('/api/saveTicket', eventController.saveTicket);
	app.post('/api/getAllEvents', eventController.getAllEvents);
	app.post('/api/saveEventImg',upload.single('image'), eventController.saveEventImg);
	app.get('/api/getEventDetails', eventController.getEventDetails);
	app.post('/api/updateEvent', eventController.updateEvent);
	app.post('/api/activeEvent', eventController.activeEvent);

	app.post('/api/getEventCategories', eventController.getEventCategories);
	// Organizer API's
	app.post('/api/organizer-registration', OrganizerController.organizerRegistration);
	app.post('/api/upsert-organizer', OrganizerController.upsert);
	app.post('/api/get-organizers', OrganizerController.view);
	app.post('/api/getOrganizerByEmail', OrganizerController.getOrganizerByEmail);
	app.post('/api/delete-organizer', OrganizerController.delete);
	app.post('/api/get-event-categories', eventController.viewEventCategories);
	app.post('/api/upsert-event-category', eventController.upsertEventCategory);
	app.post('/api/delete-event-category', eventController.deleteEventCategory);


	app.get('/api/getCounts', eventController.getCounts);
	};