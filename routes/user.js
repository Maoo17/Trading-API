var express = require('express');
var router = express.Router();
const db = require('../db/database.js');

router.get('/', (req, res) => {

  db.all('SELECT * FROM user;', (err, rows) => {
    if (err) {
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


router.get('/:email', (req, res) => {

  db.get('SELECT * FROM user WHERE email="' + req.params.email + '";', (err, row) => {
    if (err) {
      console.log(err);
      res.json({
        status: 401,
        msg: err,
      });
    } else {
      res.json({
        status: 200,
        data: row,
      });
    }
  });
});


router.put('/balance', (req, res) => {
  let { email, balance, current } = req.body;
  let added = parseInt(current) + parseInt(balance);

  if (!balance || !current) {
    res.json({
      data: {
        status: 400,
        message: 'Funds were not added',
      },
    });
  } else {
    db.run(
      'UPDATE user SET balance = ? WHERE email = ?;',
      added,
      email,
      err => {
        if (err) {
          console.log(err)
          res.json({
            data: {
              status: 400,
              message: 'Funds were not added',
              type: err,
            },
          });
        } else {
          res.json({
            data: {
              status: 202,
              message: 'Updated balance',
              newBalance: added
            },
          });
        }
      }
    );
  }
});


module.exports = router;
