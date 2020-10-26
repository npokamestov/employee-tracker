const connection = require('../db/database');

const createDepartment = (name) => {
    const sql = `INSERT INTO department (name)
                VALUES (?)`;
    const params = [name];
    connection.promise().query(sql, params)
    .then( ([rows, fields]) => {
    })
    .catch(console.log)
};

const deleteDepartment = (id) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
        })
        .catch(console.log)
};

module.exports = { createDepartment, deleteDepartment };