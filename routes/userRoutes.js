var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const auth=require('../routes/middlewares/authenticateToken')
const upload = require('../routes/middlewares/multerUpload');

router.post('/profile',auth, userController.profile);
router.put('/:userId',upload.single('profilePic'),auth, userController.editProfile);
module.exports = router;
