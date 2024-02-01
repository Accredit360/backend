const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  headOfInstitute: { type: String, required: true },
  aisheNumber: { type: String, required: true, unique: true }, // Ensure uniqueness
  phoneNumber: { type: String, required: true, unique: true }, // Ensure uniqueness
  email: { type: String, required: true, unique: true }, // Ensure uniqueness
  spocId: { type: String, required: true },
}, { timestamps: true });

const Institute = mongoose.model('Institute', InstituteSchema);

module.exports = Institute;
