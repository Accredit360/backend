const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.dbURL
mongoose.connect(url, { useNewUrlParser: true})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
