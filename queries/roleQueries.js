const connection = require('../db/database');
// const inputCheck = require('../utils/inputCheck');

const createRole = ( body ) => {
    const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
    const params = [body['title'], body['salary'], body['department_id']];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
    })
    .catch(console.log)
};

const deleteRole = (id) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
    })
    .catch(console.log)
};

module.exports = { createRole, deleteRole };