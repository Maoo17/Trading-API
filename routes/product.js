"use strict";
const express = require('express');
const router = express.Router();
const db = require('../db/database.js');

router.get('/', (req, res) => {

    db.all('SELECT * FROM product;', (err, rows) => {
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

router.get('/all/:ownerId/', (req, res) => {
    const ownerId = req.params.ownerId;

    db.all('SELECT * FROM deposit WHERE ownerId="' + ownerId + '";', (err, rows) => {

        if (err) {
            console.log(err);
            res.json({
                status: 401,
                msg: err,
            });
        } else {
            res.json({
                status: 200,
                data: rows,
            });
        }
    });
});

router.get('/:ownerId', (req, res) => {
    let allProducts = [];

    const ownerId = req.params.ownerId;

    db.all('SELECT * FROM deposit WHERE ownerId="' + ownerId + '";', (err, rows) => {

        if (err) {
            console.log(err);
            res.json({
                status: 401,
                msg: err,
            });
        } else {
            rows.forEach(item => {
                allProducts.push(item.productId);
            });

            let inClause = allProducts.toString().replace(",", ", ");

            db.all('SELECT * FROM product WHERE id IN (' + inClause + ');', (err, rows) => {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 401,
                        msg: err,
                    });
                } else {
                    res.json({
                        status: 200,
                        data: rows,
                    });
                }
            });
        }
    });
});

router.put('/sell', (req, res) => {
    const { email, depositId, balance, price } = req.body;
    let newBalance = balance + price;
    console.log(req.body);



    db.run(
        'UPDATE user SET balance = ? WHERE email = ?;',
        newBalance,
        email,
        err => {
            if (err) {
                console.log(err);
                res.json({
                    data: {
                        status: 400,
                        error: err,
                        type: "Update Error",
                    },
                });
            } else {
                db.run(
                    'DELETE FROM deposit WHERE ownerId = ? AND depositId = ?;',
                    email,
                    depositId,
                    err => {
                        if (err) {
                            console.log(err);
                            res.json({
                                data: {
                                    status: 400,
                                    error: err,
                                    type: "Delete Error",
                                },
                            });
                        } else {
                            res.json({
                                data: {
                                    status: 200,
                                    message: 'Product Sold',
                                    balance: newBalance
                                },
                            });
                        }
                    }
                );
            }
        }
    );
});

router.post('/buy', (req, res) => {
    const { email, productId, balance, price } = req.body;
    let newBalance = balance - price;

    db.run(
        'INSERT INTO deposit (ownerId, productId) VALUES (?, ?);',
        email,
        productId,
        err => {
            if (err) {
                res.json({
                    data: {
                        status: 400,
                        error: 'Error',
                        type: err,
                    },
                });
            } else {
                db.run(
                    'UPDATE user SET balance = ? WHERE email = ?;',
                    newBalance,
                    email,
                    err => {
                        if (err) {
                            console.log(err);
                            res.json({
                                data: {
                                    status: 400,
                                    error: err,
                                },
                            });
                        } else {
                            res.json({
                                data: {
                                    status: 202,
                                    message: `Product bought by ${email}`,
                                    balance: newBalance
                                },
                            });
                        }
                    }
                );
            }
        }
    );
});

module.exports = router;