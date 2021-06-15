const controllers = require('./../controllers/controllers');

const express = require('express');

const router = express.Router();

const multer = require('multer');
const upload = multer();

router.get('/', controllers.home);
router.get('/register', controllers.registerPage);
router.post('/register', upload.none(), controllers.register);
router.post('/login', controllers.login);
router.get('/logout', controllers.logout);
router.get('/app', controllers.app);

module.exports = router;