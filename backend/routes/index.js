const { sendMail, eventController} = require('../controllers');

const AuthController = require('../controllers').AuthController;
const upload = require('../middlewares/multer');
//Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome'
		})
	);

	app.post('/api/authenticate', AuthController.authenticate);
	app.post('/api/verifyEmail', AuthController.verifyEmail);
	app.post('/api/sendOtp', sendMail.sendOtp);
	app.post('/api/saveEvent', eventController.saveEvent);
	app.post('/api/getAllEvents', eventController.getAllEvents);
	app.post('/api/saveEventImg',upload.single('image'), eventController.saveEventImg);
	app.get('/api/getEventDetails', eventController.getEventDetails);
	app.post('/api/updateEvent', eventController.updateEvent);

 
	};