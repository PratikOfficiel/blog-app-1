const router = require('express').Router();
const userController = require('../controllers/user.js');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;