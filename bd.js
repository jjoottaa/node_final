var mysql = require('mysql');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host: "remotemysql.com",
    user: "9Q3rHEu2Fk",
    database:"9Q3rHEu2Fk",
    password: "BHx5kQB1Bn",
    port:"3306"
});
module.exports = pool;