const Institute = require('../models/Institute'); // Import your User model

const createInstitute = async (req, res) => {
    try {
        const { name, address, headOfInstitute, aisheNumber, phoneNumber, email, spocId } = req.body;

        // Create the institute, relying on MongoDB to enforce uniqueness
        const institute = new Institute({
            name,
            address,
            headOfInstitute,
            aisheNumber,
            phoneNumber,
            email,
            spocId
        });

        await institute.save();
        res.status(201).json({ message: "Institute registered successfully.", institute });

    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            let field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `An institute with that ${field} already exists.` });
        }
        res.status(500).json({ message: "Error registering institute.", error: error.message });
    }
};

const getInstitute = async (req, res) => {
    try {
        // Assuming the ID is sent in the body for a POST request
        const { id } = req.body;
        const institute = await Institute.findById(id);

        if (!institute) {
            return res.status(404).json({ message: "Institute not found." });
        }

        // Additional authorization logic can go here, e.g., checking if the user has permission to view this institute
        res.status(200).json(institute);
    } catch (error) {
        res.status(500).json({ message: "Error fetching institution details.", error: error.message });
    }
}

module.exports = { createInstitute,getInstitute };