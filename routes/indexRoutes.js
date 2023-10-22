const express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexcontroller');
router.get('/', indexController.index);

module.exports = router;
