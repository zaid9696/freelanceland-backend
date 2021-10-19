const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app.js');

const db = process.env.DATABASE;

mongoose.connect(db).then(con => console.log('MongoDB Connection Successfully'))

const port = process.env.HOST_PORT || 5000;

app.listen(port, (req, res) => {

	console.log(`App running on port ${port}`);
})

