const instituteController = require('../controllers/institutionController');
const router = require('./authRoutes');
const auth=require('./middlewares/authenticateToken')

router.post('/create',auth, instituteController.createInstitute);
router.post('/instituteDetails', auth, instituteController.getInstitute);

module.exports = router;