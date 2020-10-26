const connection = require('../db/database');

const createEmployee = (body) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
    const params = [body['first_name'], body['last_name'], body['role_id'], body['manager_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
        })
        .catch(console.log)
};

const updateEmpRole = (body) => {
    const sql = `UPDATE employee SET role_id = ?
                WHERE id = ?`;
    const params = [body['role_id'], body['employee_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
        })
        .catch(console.log)
};

const updateEmpManager = (body) => {
    const sql = `UPDATE employee SET manager_id = ?
                WHERE id = ?`;
    const params = [body['manager_id'], body['employee_id']];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
        })
        .catch(console.log)
};

const deleteEmployee = (id) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [id];
    connection.promise().query(sql, params)
        .then( ([rows, fields]) => {
        })
        .catch(console.log)
};

module.exports = { createEmployee, updateEmpRole, updateEmpManager, deleteEmployee };