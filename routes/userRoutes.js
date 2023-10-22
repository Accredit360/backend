var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const auth=require('../routes/middlewares/authenticateToken')

router.post('/profile',auth, userController.profile);
module.exports = router;
