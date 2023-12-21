const express = require('express');
const multer = require('multer');
const router = express.Router();

const registerHandler = require('./handlers/registerHandler');
const { loginHandler, logoutHandler } = require('./handlers/loginHandler');
const {initialPreferenceHandler} = require('./handlers/preferenceHandler');
const {getUserDataHandler, updateUserHandler} = require('./handlers/usersHandler');
const {postHistory, getHistory} = require('./handlers/historyHandler');
const upload = multer();

// Register route
router.post('/register', upload.none(), registerHandler);

// Login route
router.post('/login', upload.none(), loginHandler);

// Logout route
router.post('/logout', upload.none(), logoutHandler)

// Initialize preference route
router.post('/initpreference', upload.none(), initialPreferenceHandler);

// get user data route
router.get('/getuserdata', upload.none(), getUserDataHandler);

// update user data route
router.post('/updateuserdata', upload.none(), updateUserHandler);

// post history route
router.post('/history', upload.none(), postHistory);

// get history route
router.get('/history', upload.none(), getHistory);

module.exports = router;