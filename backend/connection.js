const mysql = require('mysql2');
const secret = require('./secret.json');

const connection = mysql.createConnection({
  host: 'localhost',
  user: secret.user,
  password: secret.password,
  database: 'formulapp',
});

module.exports = connection;
