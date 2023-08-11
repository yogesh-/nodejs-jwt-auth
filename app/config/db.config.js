const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"simpleBlog"
})

module.exports = db