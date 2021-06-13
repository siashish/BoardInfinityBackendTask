const express = require('express');
const connectDB = require('./config/database.js');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
};

const app = express();

//connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.json({ msg: 'welcome to boardinfinity api' }));

//Define routes
app.use(require('./routes/users'));
app.use(require('./routes/login'));
app.use(require('./routes/resetpassword'));


const PORT = process.env.PORT || 5000;

https.createServer(options, app).listen(PORT, () => console.log(`Listening on port ${PORT}`));