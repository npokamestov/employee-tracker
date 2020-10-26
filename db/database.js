const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    // port: 3001,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'my_password',
    database: 'employee_tracker'
});

connection.connect(err => {
    if (err) {
        console.log(err)
    }
    console.log('Connected as id ' + connection.threadId);
});

module.exports = connection;