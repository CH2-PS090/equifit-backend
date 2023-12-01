const express = require('express');
const multer = require('multer');
const router = express.Router();

const registerHandler = require('./handlers/registerHandler');
const loginHandler = require('./handlers/loginHandler');

const upload = multer();

// Register route
router.post('/register', upload.none(), registerHandler);

// Login route
router.post('/login', upload.none(), loginHandler);

module.exports = router;