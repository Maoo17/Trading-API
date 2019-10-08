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


router.get('/:id', (req, res) => {

  db.get('SELECT * FROM user WHERE id=' + req.params.id + ';', (err, row) => {
    if (err) {
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
  let { id, balance } = req.body;

  db.run(
    'UPDATE user SET balance = ? WHERE id = ?;',
    balance,
    id,
    err => {
      if (err) {
        res.json({
          data: {
            status: 400,
            error: 'User was not registered!',
            type: err,
          },
        });
      } else {
        res.json({
          data: {
            status: 202,
            message: 'Updated balance',
          },
        });
      }
    }
  );
});


module.exports = router;
