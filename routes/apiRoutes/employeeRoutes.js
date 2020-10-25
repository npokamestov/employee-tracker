const express = require('express');
const router = express.Router();
const connection = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/employeesdata', (req, res) => {
    const sql = `SELECT * FROM employee`;
    const params = [];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/employees', (req, res) => {
    const sql = `SELECT emp.id AS employee_id,
                emp.first_name AS first_name,
                emp.last_name AS last_name,
                role.title AS title,
                department.name AS department,
                role.salary AS salary,
                CONCAT(man.first_name, ' ', man.last_name) AS manager_name
                FROM employee emp
                LEFT JOIN role ON emp.role_id = role.id
                LEFT JOIN employee man ON man.id = emp.manager_id
                LEFT JOIN department ON role.department_id = department.id`;
    const params = [];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.post('/employee', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'role_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO employee (first_name, last_name, role_id)
                VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.role_id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully added',
            data: body,
            id: this.lastID
        });
    });
});

router.put('/employee_role/:id', (req, res) => {
    const errors = inputCheck(req.body, 'role_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE employee SET role_id = ?
                WHERE id = ?`;
    const params = [req.body.role_id, req.params.id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully updated',
            data: req.body,
            changes: this.changes
        });
    });
});

router.put('/employee_manager/:id', (req, res) => {
    const errors = inputCheck(req.body, 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE employee SET manager_id = ?
                WHERE id = ?`;
    const params = [req.body.manager_id, req.params.id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'successfully updated',
            data: req.body,
            changes: this.changes
        });
    });
});

router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];
    connection.query(sql, params, function(err, result) {
        if (err) {
            res.status(400).json ({ error: res.message });
            return
        }
        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

module.exports = router;