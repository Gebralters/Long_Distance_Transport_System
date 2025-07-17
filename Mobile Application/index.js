const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123', 
  database: 't38database2',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

const createDatabaseAndTables = () => {
  const queries = [
    `CREATE DATABASE IF NOT EXISTS t38database2;`,
    `USE t38database2;`,
    `CREATE TABLE IF NOT EXISTS USERS (
        U_ID INT AUTO_INCREMENT NOT NULL,
        U_FIRSTNAME VARCHAR(250) NOT NULL,
        U_SURNAME VARCHAR(250) NOT NULL,
        U_EMAIL VARCHAR(1000) NOT NULL,
        U_TITLE VARCHAR(10) NOT NULL,
        U_CONTACT VARCHAR(255) NOT NULL,
        U_PASSWORD TEXT NOT NULL,
        U_USERTYPE INT NOT NULL,
        U_REGDATE DATETIME NOT NULL,
        PRIMARY KEY(U_ID)
      );`

  ];

  queries.forEach((query) => {
    db.query(query, (err, result) => {
      if (err) throw err;
      console.log('Query executed:', query);
    });
  });
};

createDatabaseAndTables();

app.post('/api/register', (req, res) => {
    const { firstName, lastName, email, title, contactNumber, password, userType, regDate } = req.body;
    const sql = 'INSERT INTO USERS (U_FIRSTNAME, U_SURNAME, U_EMAIL, U_TITLE, U_CONTACT, U_PASSWORD, U_USERTYPE, U_REGDATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, title, contactNumber, password, userType, regDate], (err, result) => {
      if (err) {
        res.status(500).send('Error registering user');
      } else {
        res.status(200).send('User registered');
      }
    });
  });

app.post('/api/login', (req, res) => {
const { email, password } = req.body;
const sql = 'SELECT * FROM USERS WHERE U_EMAIL = ? AND U_PASSWORD = ?';
db.query(sql, [email, password], (err, result) => {
    if (err) {
    res.status(500).send('Error logging in');
    } else if (result.length === 0) {
    res.status(401).send('Invalid credentials');
    } else {
    res.status(200).json({ user: result[0] });
    }
});
});

// will define other routes here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
