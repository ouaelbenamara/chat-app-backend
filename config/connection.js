const mongoose = require('mongoose')
require('dotenv').config();

const DB_URI = process.env.DB_URI;

    mongoose.connect(DB_URI);


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB!');
});
