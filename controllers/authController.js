const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const activeTokens = require('../tokenManager');
const fs = require('fs');
const { isValidEmail, isValidPhoneNumber, cleanupUploadedFile } = require('../helpers/validation');
//--------------------------------------------------------------------------------------------------------------------------------------//

//--------------------------------------------ROUTES------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------//
// Check for duplicate email, username, and phone


const register = async (req, res) => {
    const { name, phone, email, username, password, facCode, department, designation,qualification } = req.body;
    console.log(req.body);

    let profilePic;
    const isDuplicate = await User.findOne({
        $or: [{ email }, { username }, { phone }],
    });
    //check dup
    if (isDuplicate) {
        if (req.file && req.file.path) {
            cleanupUploadedFile(req.file.path);
        }
        return res.status(400).json({ message: 'Duplicate email, username, or phone number' });
    }
    if (req.file) {
        profilePic = req.file.path; // Save the path to the profile picture if it was uploaded

    }

    try {
        if (!isValidEmail(email) || !isValidPhoneNumber(phone)) {
            if (req.file && req.file.path) {
                cleanupUploadedFile(req.file.path);
            }
            return res.status(400).json({ message: 'Invalid email or phone format' });
        }


        const user = new User({ name, phone, email, username, password, facCode, department, profilePic, designation,qualification });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (req.file && req.file.path) {
            cleanupUploadedFile(req.file.path);
        }
        console.error(error);
        res.status(400).json({ message: 'Bad request' });
    }
};


const login = async (req, res) => {
    const token = req.headers.authorization;
    console.log(req.body);

    if (!token) {
        const { username, password } = req.body;
        try {
            // Find the user by username
            const user = await User.findOne({ username });

            if (!user) {
                res.status(401).json({ message: 'Authentication failed' });
                return;
            }

            // Check if the password is correct (you should use a proper password hashing method)
            if (user.password === password) {
                // Create a JWT token
                const token = jwt.sign({ userId: user._id }, process.env.jwtsecret, { expiresIn: '1h' }); // Adjust the expiration time as needed
                activeTokens.add(token);
                res.status(200).json({ message: 'Login successful', token, user: { id: user._id } });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.send('Already Logged In, Try clearing cookies.')
    }
};
const logout = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    // Check if the token is in the activeTokens set
    if (activeTokens.has(token)) {
        // Remove the token (this step is optional and can be used for blacklisting)
        activeTokens.delete(token);

        return res.status(200).json({ message: 'Logout successful' });
    }

    res.status(401).json({ message: 'Invalid or expired token' });
};

module.exports = { register, login, logout };
