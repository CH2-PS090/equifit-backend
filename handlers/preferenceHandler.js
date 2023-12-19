const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');
const { getTokenData } = require('./authenticationHandler');
const pool = mysql.createPool(dbConfig);

async function initialPreferenceHandler(req, res) {
  const { type, muscle, difficulty } = req.body;

  try {
    const authHeader = req.headers['authorization'];

    const { userId, email } = getTokenData(authHeader);

    const [userResults] = await pool.query('SELECT * FROM preferences WHERE userId = ?', [userId]);

    if (userResults.length > 0) {
      res.status(200).json({ status: 200, message: 'User preferences already exists, go to main menu.' });
      return;
    }
          
    var frontQuery = `INSERT INTO preferences (userId, `;
    var endQuery = ` ) VALUES (${userId}, `;
    var separator = false;

    if(type !== undefined){
      frontQuery += 'type';
      endQuery += `'${type}'`;
      separator = true;
    }

    if(muscle !== undefined){
      if(separator){
        frontQuery += ', ';
        endQuery += ', ';
      }
      frontQuery += 'muscle';
      endQuery += `'${muscle}'`;
      separator = true;
    }

    if(difficulty !== undefined){
      if(separator){
        frontQuery += ', ';
        endQuery += ', '
      }
      frontQuery += 'difficulty';
      endQuery += `'${difficulty}'`;
      separator = true;
    }
    const textQuery = frontQuery + endQuery + ')';
    try {
      const [results] = await pool.query(textQuery);
      res.status(201).json({ status: 201, message: 'User preferences successfully added' });
    } catch (error) {
      console.error('Error registering user preferences:', error);
      res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(401).json({ status: 401, message: 'Error! Unauthorized attempt!' });
    return;
  }
}

module.exports = {initialPreferenceHandler};