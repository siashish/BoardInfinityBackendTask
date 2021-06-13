const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const version = config.get('version');
const passwordSecret = config.get('passwordSecret');
const emailid = config.get('emailid');
const emailpass = config.get('emailpass');
var nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const User = require('../models/User');


router.post('/api/' + version + '/forget/password', async (req, res) => {

    const { email } = req.body;
    try {

        //Checking if the email exists
        let user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "Invalid username" });


        //create and assign a token 
        const payload = {
            id: user.id
        }
        jwt.sign(payload, passwordSecret, {
            expiresIn: '20m'
        }, (err, token) => {
            if (err) throw err
            const url = `http://localhost:4000/api/v1.0/reset/password?token=${token}`

            var transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    ciphers: 'SSLv3'
                },
                auth: {
                    user: emailid,
                    pass: emailpass
                }
            });

            var mailOptions = {
                from: "BoardInfinity \<alerts@boardinfinity.com\>",
                to: user.firstName + " " + user.lastName + " \<" + user.email + "\>",
                subject: 'BoardInfinity account password reset',
                html: `Hi ${user.firstName} ${user.lastName} 
                We received a request to reset your password. If you made this request, please follow this link: <a href="${url}">Click here</a>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send({ msg: 'Email Send Successfully' })
                }
            });

        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Sorry, something went wrong. Please try again later.' });
    }
});

 
router.post('/api/' + version + '/reset/password', async (req, res) => {
    var token = req.query.token;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, passwordSecret);

        //Checking if the user exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(400).send({ "error": "invalid user" });

        //hash the password
        const salt = await bcrypt.genSalt(10);

        resetedpassword = await bcrypt.hash(password, salt);

        User.findOneAndUpdate(
            { _id: decoded.id }, // find a document with that filter
            { password: resetedpassword }, // document to insert when nothing was found
            //{ upsert: true, new: true, runValidators: true }, // options
            function (err, doc) { // callback
                ////console.log(doc);
                if (err) {
                    //console.log(err);
                    return res.status(500).send({ "error": "Something went wrong. Please try again later." });
                } else {
                    //console.log({ status: 'success', message: 'password reset successfully' });
                    return res.status(200).json({ status: 'success', message: 'password reset successfully' });
                }
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'server error' });
    }
});

module.exports = router;