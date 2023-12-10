const express = require('express');
const multer = require('multer');
const router = express.Router();

const registerHandler = require('./handlers/registerHandler');
const loginHandler = require('./handlers/loginHandler');
const {initialPreferenceHandler, updatePreferenceHandler} = require('./handlers/preferenceHandler');

const upload = multer();

// Register route
router.post('/register', upload.none(), registerHandler);

// Login route
router.post('/login', upload.none(), loginHandler);

// Initialize preference route
router.post('/initpreference', upload.none(), initialPreferenceHandler);

router.post('/updatepreference', upload.none(), updatePreferenceHandler);

module.exports = router;