const express = require('express');
const router = express.Router();
const db = require('../db/database.js');
const authentication = require('../middleware/authentication');

router.post('/validatetoken/:token', (req, res) => {
  let token = req.params.token;
  authentication.checkTokenForAuthentication(token, req, res);
});

router.post('/validateemail/:email', (req, res) => {
  let email = req.params.email;
  //get email and compare then return status.
});


router.post('/', (req, res) => {
  let loginData = {
    email: req.body.email,
    password: req.body.password,
  };

  let sqlquery = 'SELECT * FROM users WHERE email="' + loginData.email + '"';

  db.get(sqlquery, (err, row) => {
    if (err) {
      res.json({ 'Following error occured': err });
    } else {
      authentication.checkForCorrectLogin(row, loginData.password, loginData.email, res);
    }
  });
});


router.post('/register', (req, res) => {
  let registrationData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
    email: req.body.email,
    password: req.body.password,
  };

  bcrypt.hash(registrationData.password, saltRounds, function (err, hash) {
    db.run(
      'INSERT INTO users (firstName, lastName, birthday, email, password, balance) VALUES (?, ?, ?, ?, ?, ?)',
      registrationData.firstName,
      registrationData.lastName,
      registrationData.birthday,
      registrationData.email,
      hash,
      0,
      err => {
        if (err) {
          res.json({
            data: {
              status: 500,
              error: 'User was not registered!',
              type: err,
            },
          });
        } else {
          res.json({
            data: {
              status: 200,
              message: 'Registered user!',
            },
          });
        }
      }
    );
  });
});


module.exports = router;
