const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    facCode: { type: String, required: true }, // Faculty code
    department: { type: String, required: true },
    profilePic: { type: String, default: null }, // Path to the profile picture
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
