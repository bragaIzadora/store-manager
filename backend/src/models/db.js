const mysql = require('mysql2/promise');

console.log(process.env.MYSQL_HOSTNAME);
const connection = mysql.createPool({
  host: process.env.MYSQL_HOSTNAME || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  port: process.env.MYSQL_PORT || 3306,
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'StoreManager',
});

module.exports = connection;