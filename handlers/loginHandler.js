const mysql = require('mysql2/promise');
const { generateToken } = require('./authenticationHandler');
const bcrypt = require('bcrypt');
const dbConfig = require('../dbConfig');

const pool = mysql.createPool(dbConfig);

async function loginHandler(req, res) {
  const { email, password } = req.body;

  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length > 0) {
      const user = results[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // creating token
        const token = generateToken(user.id, user.email);

        // Set token to header
        res.header('Authorization', `Bearer ${token}`);

        // check preference available?
        const [userResults] = await pool.query('SELECT * FROM preferences WHERE userId = ?', [user.id]);

        var preference = '';

        if (userResults.length > 0) {
         preference = 'filled';
        } else {
          preference = 'None';
        }

        result = {
            token: token,
            user_id: user.id,
            name: user.name,
            email : user.email,
            preference : preference,
        };

        // success response
        res.json({ status: 200, message: 'Login successful', result });
      } else {
        // password did not match
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
      }
    } else {
        // no email found
      res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 500, message: 'Error: Internal Server Error' });
  }
}

module.exports = loginHandler;
