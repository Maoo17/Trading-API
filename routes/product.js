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


router.post(
    '/',
    (req, res, next) => authentication.checkToken(req, res, next),
    (req, res) => {
        const { owner, title, imgurl, amount, price } = req.body;

        db.run(
            'INSERT INTO product (owner, title, amount, price) VALUES (?, ?, ?, ?);',
            owner,
            title,
            imgurl,
            amount,
            price,
            err => {
                if (err) {
                    res.json({
                        status: 401,
                        msg: err,
                    });
                } else {
                    res.json({
                        data: {
                            status: 201,
                            msg: 'Created product',
                        },
                    });
                }
            }
        );
    }
);

// router.put('/', (req, res) => {
//     const { id,  } = req.body;

//     db.run(
//       'UPDATE users SET balance = ? WHERE id = ?;',
//       balance,
//       id,
//       err => {
//         if (err) {
//           res.json({
//             data: {
//               status: 400,
//               error: 'User was not registered!',
//               type: err,
//             },
//           });
//         } else {
//           res.json({
//             data: {
//               status: 202,
//               message: 'Updated balance',
//             },
//           });
//         }
//       }
//     );
// });

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run(
        'DELETE FROM product WHERE id = ?;',
        id,
        err => {
            if (err) {
                res.json({
                    data: {
                        status: 400,
                        error: err,
                    },
                });
            } else {
                res.json({
                    data: {
                        status: 200,
                        message: 'Product deleted',
                    },
                });
            }
        }
    );
});

module.exports = router;