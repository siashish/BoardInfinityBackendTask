const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const version = config.get('version');
const jwt = require('jsonwebtoken');
const jwtSecret = config.get('jwtSecret');

const User = require('../models/User');
const { userregistervalidation } = require('../validation');

router.post('/api/' + version + '/user/signup', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE ADD LOGIN
    const { error } = userregistervalidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { firstName, lastName, email, mobileno, password, userType } = req.body;
    try {
        let user = await User.findOne({ email });
        //Checking if the user is already in database
        //const emailExist = await User.findOne({ email });
        if (user) {
            return res.status(400).json('email already exist');
        }
        //POST Create the new user
        user = new User({
            firstName,
            lastName,
            email,
            mobileno,
            password,
            userType
        });
        //hash the password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        const payload = {
            email: user.email,
            id: user.id
        }
        jwt.sign(payload, jwtSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err
            res.status(200).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again later.' });
    }
});

module.exports = router;