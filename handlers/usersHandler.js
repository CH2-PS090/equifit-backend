const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');
const { getTokenData } = require('./authenticationHandler');
const pool = mysql.createPool(dbConfig);
const bcrypt = require('bcrypt');

async function getUserDataHandler(req, res) {
  try{
    const authHeader = req.headers['authorization'];
    const { userId, email } = getTokenData(authHeader);
    const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = results[0];
    const [userResults] = await pool.query('SELECT * FROM preferences WHERE userId = ?', [userId]);
    const preference = userResults
    const result = {
      userData : user,
      preferences : preference,
    };
    res.json({ status: 200, message: 'Successfully get user data', result });
  }catch(error){
    console.error('Error:', error);
    res.status(401).json({ status: 401, message: 'Error! Unauthorized attempt!' });
    return;
  }
}

async function updateUserHandler(req, res) {
  const { name, newEmail, newPassword, newPasswordConfirmation, type, muscle, difficulty } = req.body;

  try {
    const authHeader = req.headers['authorization'];
    const { userId, email } = getTokenData(authHeader);

    if(name !== undefined || newEmail !== undefined || newPassword !== undefined || newPasswordConfirmation !== undefined) {
      var textQuery = 'UPDATE users SET ';
      var separator = false;

      if(name !== undefined){
        textQuery += `name = '${name}'`;
        separator = true;
      }
            
      if(newEmail !== undefined){
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [newEmail]);
  
        if (existingUser.length > 0) {
          res.status(409).json({ status: 409, message: 'Email already exists' });
          return;
        }

        if(separator){
          textQuery += ', ';
        }
        textQuery += `email = '${newEmail}'`;
        separator = true;
      }

      if(newPassword !== undefined){
        if(newPassword !== newPasswordConfirmation){
          res.status(401).json({ message: 'password did not match' });
          return;
        }

        if(password.length < 8){
          res.status(401).json({ message: 'password must be 8 or more characters' });
          return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if(separator){
          textQuery += ', ';
        }
        textQuery += `password = '${hashedPassword}'`;
        separator = true;
      }
      textQuery += ` WHERE id = ${userId}`;
      try {
        const [results] = await pool.query(textQuery);
      } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ status: 500, message: 'Error updating user data' });
      }
    }

    if(type !== undefined || muscle !== undefined || difficulty !== undefined) {     
      var textQuery = 'UPDATE preferences SET ';
      var separator = false;

      if(type !== undefined){
        textQuery += `type = '${type}'`;
        separator = true;
      }
            
      if(muscle !== undefined){
        if(separator){
          textQuery += ', ';
        }
        textQuery += `muscle = '${muscle}'`;
        separator = true;
      }

      if(difficulty !== undefined){
        if(separator){
          textQuery += ', ';
        }
        textQuery += `difficulty = '${difficulty}'`;
        separator = true;
      }
      textQuery += ` WHERE userId = ${userId}`;
      try {
        const [results] = await pool.query(textQuery);
      } catch (error) {
        console.error('Error registering user preferences:', error);
        res.status(500).json({ status: 500, message: 'Error updating user preferences' });
      }
    }
    res.status(201).json({ status: 201, message: 'User data successfully updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(401).json({ status: 401, message: 'Error! Unauthorized attempt!' });
    return;
  }
}

module.exports = {getUserDataHandler, updateUserHandler};