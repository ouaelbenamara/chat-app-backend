const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true, unique: true },
    salt: { type: String, required: true, unique: true }
})



// creating the modal User 
const User = mongoose.model('User', userSchema);


module.exports = User;