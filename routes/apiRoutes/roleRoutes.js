const express = require('express');
const router = express.Router();
const connection = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/rolesdata', (req, res) => {
    const sql = `SELECT * FROM role`;
    const params = [];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/roles', (req, res) => {
    const sql = `SELECT role.title AS title,
                role.id AS role_id,
                department.name AS department_name,
                role.salary AS salary
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;
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

router.post('/role', ({ body }, res) => {
    const errors = inputCheck(body, 'title', 'salary', 'department_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO role (title, salary, department_id)
                VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];
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

router.delete('/role/:id', (req, res) => {
    const sql = `DELETE FROM role WHERE id = ?`;
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