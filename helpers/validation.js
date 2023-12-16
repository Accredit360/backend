const PhoneNumber = require('libphonenumber-js');


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

function cleanupUploadedFile(filePath) {
    fs.unlink(filePath, err => {
        if (err) {
            console.error("Error during file cleanup:", err);
        } else {
            console.log(`Successfully deleted temporary file: ${filePath}`);
        }
    });
}
// export
module.exports = { isValidEmail, isValidPhoneNumber, cleanupUploadedFile };