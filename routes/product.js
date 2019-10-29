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

router.put('/sell', (req, res, next) => {
    let { email, balance, price } = req.body;
    let newBalance = parseInt(balance) + parseInt(price);

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
            }
            next()
        }
    );
}, (req, res, next) => {
    let { price, productId } = req.body;
    let calculationNumber = Math.round(parseInt(price) - parseInt(price) / 3);
    let newPrice = calculationNumber >= 0 ? calculationNumber : parseInt(price);

    db.run(
        'UPDATE product SET startingPrice = ? WHERE id = ?;',
        newPrice,
        productId,
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
            }
            next()
        }
    );
}, (req, res, next) => {
    let { email, depositId } = req.body;

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
            }
            next()
        }
    );
}, (req, res) => {
    let { email, balance, price, title } = req.body;
    let newBalance = parseInt(balance) + parseInt(price);
    let date = new Date();

    db.run(
        'INSERT INTO history (email, note, type, price, occurred) VALUES (?, ?, ?, ? , ?);',
        email,
        title,
        "Sold",
        price,
        date,
        err => {
            if (err) {
                console.log(err);
                res.json({
                    data: {
                        status: 400,
                        error: err,
                        type: "Insert Error",
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
});

router.post('/buy', (req, res, next) => {
    const { email, productId } = req.body;

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
            }
            next();
        }
    );
}, (req, res, next) => {
    const { email, balance, price } = req.body;
    let newBalance = parseInt(balance) - parseInt(price);

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
            }
            next();
        }
    );
}, (req, res, next) => {
    let { price, productId } = req.body;
    let calculationNumber = Math.round(parseInt(price) + parseInt(price) / 3);
    let newPrice = calculationNumber >= 0 ? calculationNumber : parseInt(price);

    db.run(
        'UPDATE product SET startingPrice = ? WHERE id = ?;',
        newPrice,
        productId,
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
            }
            next()
        }
    );
}, (req, res) => {
    let { email, balance, price, title } = req.body;
    let newBalance = parseInt(balance) - parseInt(price);
    let transactionPrice = `-${price}`;
    let date = new Date().toString();

    db.run(
        'INSERT INTO history (email, note, type, price, occurred) VALUES (?, ?, ?, ? , ?);',
        email,
        title,
        "Bought",
        transactionPrice,
        date,
        err => {
            if (err) {
                console.log(err);
                res.json({
                    data: {
                        status: 400,
                        error: err,
                        type: "Insert Error",
                    },
                });
            } else {
                res.json({
                    data: {
                        status: 202,
                        message: 'Product Bought',
                        balance: newBalance
                    },
                });
            }
        }
    );
});



module.exports = router;