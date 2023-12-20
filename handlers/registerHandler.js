const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');
const bcrypt = require('bcrypt');
const pool = mysql.createPool(dbConfig);

async function registerHandler(req, res) {
  const { email, name, password, passwordConfirmation} = req.body;

  if(password != passwordConfirmation){
    res.status(401).json({ message: 'password did not match' });
    return;
  }

  if(password.length < 8){
    res.status(401).json({ message: 'password must be 8 or more characters' });
    return;
  }
  
  // encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
    if (existingUser.length > 0) {
      res.status(409).json({ status: 409, message: 'Email already exists' });
    } else {
      const [results] = await pool.query('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, hashedPassword]);
      res.status(201).json({ status: 201, message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
  
}

module.exports = registerHandler;