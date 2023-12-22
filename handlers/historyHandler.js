const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');
const { getTokenData } = require('./authenticationHandler');
const pool = mysql.createPool(dbConfig);

async function postHistory(req, res) {
    const today = new Date();
    const { 
        ankle,
        arm_length,
        bicep,
        calf,
        chest,
        forearm,
        neck,
        hip,
        leg_length,
        shoulder_breadth,
        shoulder_to_crotch,
        thigh,
        waist,
        wrist,
        bodyfat
    } = req.body;
  
    try {
      const authHeader = req.headers['authorization'];
      const { userId, email } = getTokenData(authHeader);
        try {
            const [results] = await pool.query(
                'INSERT INTO history (id_user, Ankle, Arm_length, Bicep, calf, chest, forearm, neck, hip, leg_length, shoulder_breadth,shoulder_to_crotch,thigh,waist,wrist,bodyfat,last_check) VALUES (?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?, ?,?, ?)', 
                [userId,ankle,arm_length,bicep,calf,chest,forearm,neck,hip,leg_length,shoulder_breadth,shoulder_to_crotch,thigh,waist,wrist,bodyfat,today]
                );
            res.status(201).json({ status: 201, message: 'User history successfully added' });
          } catch (error) {
            console.error('Error insert user history:', error);
            res.status(500).json({ status: 500, message: 'Internal Server Error' });
          }
    } catch (error) {
      console.error('Error:', error);
      res.status(401).json({ status: 401, message: 'Error! Unauthorized attempt!' });
      return;
    }
  }

async function getHistory(req, res) {
    try{
        const authHeader = req.headers['authorization'];
        const { userId, email } = getTokenData(authHeader);
        const [results] = await pool.query('SELECT * FROM history WHERE id_user = ? ORDER BY last_check DESC LIMIT 1', [userId]);
        const history = results[0];
        const result = {
            email : email,
            history : history
        };
        res.json({ status: 200, message: 'Successfully get user history', result });
    }catch(error){
        console.error('Error:', error);
        res.status(401).json({ status: 401, message: 'Error! Unauthorized attempt!' });
        return;
    }
}
module.exports = {postHistory,getHistory};
