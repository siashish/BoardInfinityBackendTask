const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const version = config.get('version');
const auth = require('../middleware/auth');
const User = require('../models/User');


router.get('/api/' + version + '/user', auth, async (req, res) => {
	try {
		//Checking if the user exists
		const user = await User.findById(req.user.id).select('-password');
		if (!user) return res.status(400).send({ "error": "invalid user" });
		if (user.userType == 'USER') {
			res.json({ 'firstName': user.firstName, 'lastName': user.lastName, 'email': user.email, 'userType': user.userType, 'mobileno': user.mobileno });
		}
		else {
			res.status(401).json({ code: 401, msg: "you are not authorized to see this" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: 'Sorry, something went wrong. Please try again later.' });
	}
});

module.exports = router;