"use strict";
const express = require('express');
const router = express.Router();
const db = require('../db/database.js');

router.get('/', (req, res) => {

    db.all('SELECT * FROM history;', (err, rows) => {
        if (err) {
            res.json({
                status: 401,
                msg: err,
            });
        } else {
            res.json({
                status: 201,
                data: rows,
            });
        }
    });
});

router.get('/:email', (req, res) => {
    let email = req.params.email;

    db.all('SELECT * FROM history WHERE email="' + email + '";', (err, rows) => {
        if (err) {
            res.json({
                status: 401,
                msg: err,
            });
        } else {
            res.json({
                status: 201,
                data: rows,
            });
        }
    });
});

module.exports = router;
