const express = require('express');
const router = express.Router();
const db = require('../db/database.js');
const authentication = require('../middleware/authentication');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const gravatar = require('gravatar');

router.post('/validatetoken/:token', (req, res) => {
  let token = req.params.token;
  authentication.checkTokenForAuthentication(token, req, res);
});

router.post('/validateemail/:email', (req, res) => {
  const email = req.params.email;
  db.get('SELECT * FROM user WHERE email="' + email + '";', (err, row) => {
    if (err) {
      console.log(err)
      res.json({ 'Following error occured': err });
    } else {
      if (row) {
        res.status(200).send("Registered email");
      } else {
        res.status(204).send("Not a registered email");
      }
    }
  });
});


router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM user WHERE email="' + email + '";', (err, row) => {
    if (err) {
      console.log(err)
      res.json({ 'Following error occured': err });
    } else {
      authentication.checkForCorrectLogin(row, password, email, res);
    }
  });
});


router.post('/register', (req, res) => {
  const { firstName, lastName, birthday, email, password } = req.body;
  const httpsGravatar = gravatar.url(email, { protocol: 'https', s: '100' });
  bcrypt.hash(password, saltRounds, function (error, hash) {
    db.run(
      'INSERT INTO user (firstName, lastName, birthday, email, password, balance, picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
      firstName,
      lastName,
      birthday,
      email,
      hash,
      0,
      httpsGravatar,
      err => {
        if (err) {
          console.log(err)
          res.json({
            data: {
              status: 401,
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
