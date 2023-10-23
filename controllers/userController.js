const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const activeTokens = require('../tokenManager');

const profile = async (req, res) => {
    const userId = req.body.id;
    //display profile as json
    try {
        const user = await User.findById(userId).select('-isAdmin').select('-password');
       

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


module.exports = { profile };
