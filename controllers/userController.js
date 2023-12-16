const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const activeTokens = require('../tokenManager');
const { isValidEmail, isValidPhoneNumber, cleanupUploadedFile } = require('../helpers/validation');

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

const editProfile = async (req, res) => {
    const userId = req.params.userId;
    const { name, phone, email, username, facCode, department, designation, qualification } = req.body;
    let profilePic;
    // if same email or username or phone number, then no need to check for duplicate, but if different, then check for duplicate   


    if (req.file) {
        profilePic = req.file.path; // Save the path to the profile picture if it was uploaded

    }

    try {
        console.log(email);
        console.log(phone);
        console.log(!isValidEmail(email));
        console.log(!isValidPhoneNumber(phone));
        if (!isValidEmail(email) || !isValidPhoneNumber(phone)) {
            if (req.file && req.file.path) {
                cleanupUploadedFile(req.file.path);
            }
            return res.status(400).json({ message: 'Invaldddddddid email or phone format' });
        }
        const user = await User.findById(userId);
        let queryForDuplicate = [];

        if (email && email !== user.email) {
            queryForDuplicate.push({ email });
        }

        if (username && username !== user.username) {
            queryForDuplicate.push({ username });
        }

        if (phone && phone !== user.phone) {
            queryForDuplicate.push({ phone });
        }

        if (queryForDuplicate.length > 0) {
            const isDuplicate = await User.findOne({ $or: queryForDuplicate });

            if (isDuplicate) {
                if (req.file && req.file.path) {
                    cleanupUploadedFile(req.file.path);
                }
                return res.status(400).json({ message: 'Duplicate email, username, or phone number' });
            }
        }
        if (!user) {
            if (req.file && req.file.path) {
                cleanupUploadedFile(req.file.path);
            }
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.file && req.file.path) {
            user.profilePic = profilePic;
        }
        user.name = name;
        user.phone = phone;
        user.email = email;
        user.username = username;
        user.facCode = facCode;
        user.department = department;
        user.designation = designation;
        user.qualification = qualification;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = { profile, editProfile };
