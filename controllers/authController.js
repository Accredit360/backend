const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const PhoneNumber = require('libphonenumber-js');
const register = async (req, res) => {
    const { name, phone, email, username, password } = req.body;

    // Function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    // Function to validate phone number format
    const isValidPhoneNumber = (phone) => {
        try {
            const phoneNumber = PhoneNumber.parse(phone);
            return PhoneNumber.isValidNumber(phoneNumber);
        } catch (error) {
            return false;
        }
    };

    // Check for duplicate email, username, and phone
    const isDuplicate = await User.findOne({
        $or: [{ email }, { username }, { phone }],
    });

    if (isDuplicate) {
        return res.status(400).json({ message: 'Duplicate email, username, or phone number' });
    }

    // Additional XSS check for user input (sanitize)
    // Implement a function to sanitize user inputs to prevent XSS attacks
    // You can use a library like DOMPurify for this purpose

    try {
        if (!isValidEmail(email) || !isValidPhoneNumber(phone)) {
            return res.status(400).json({ message: 'Invalid email or phone format' });
        }

        const user = new User({ name, phone, email, username, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Bad request' });
    }
};

const login = async (req, res) => {
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

            res.status(200).json({ message: 'Login successful', token, user: { id:user._id } });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login };
