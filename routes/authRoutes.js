const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../routes/middlewares/multerUpload');


router.post('/register', upload.single('profilePic'), authController.register);
router.post('/login', authController.login);

router.post('/logout', authController.logout);




module.exports = router;
