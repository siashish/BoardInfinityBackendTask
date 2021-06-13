const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const version = config.get('version');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { loginvalidation } = require('../validation');


router.post('/api/' + version + '/user/login', async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE ADD LOGIN
    const { error } = loginvalidation(req.body);
    if (error) return res.status(401).json({ msg: "Invalid username or password" });
    const { email, password } = req.body;
    try {

        //Checking if the email exists
        let user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: "Invalid username or password" });
        //if (!user.email_verified) return res.status(401).json({ msg: "please confirm your email to login" });

        //checking password is correct or not 
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ msg: "Incorrect username or password" });

        //create and assign a token 
        const payload = {
            email: user.email,
            id: user.id
        }
        jwt.sign(payload, jwtSecret, {
            expiresIn: '1d'
        }, (err, token) => {
            if (err) throw err
            res.status(200).json({ token })
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again later.' });
    }
});

module.exports = router;