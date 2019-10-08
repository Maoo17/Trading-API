var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports = {
  checkToken: function (req, res, next) {
    let token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({
          status: 401,
          error: 'Invalid token',
        });
      }
      next();
    });
  },

  checkTokenForAuthentication: function (token, req, res) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({
          status: 401,
          msg: 'Invalid token',
        });
      } else {
        return res.json({
          status: 200,
          msg: 'Valid token',
        });
      }
    });
  },

  checkForCorrectLogin: function (dbResult, inputPass, inputEmail, res) {
    if (dbResult !== undefined) {
      bcrypt.compare(inputPass, dbResult.password, function (err, isCorrect) {
        if (isCorrect) {
          const payload = { email: inputEmail };
          const secret = process.env.JWT_SECRET;
          const userToken = jwt.sign(payload, secret, { expiresIn: '1h' });

          res.json({
            valid: true,
            message: 'Login sucessfull!',
            'x-access-token': userToken,
            user: dbResult,
          });
        } else {
          res.json({
            valid: false,
            message: 'Email or password is wrong.',
          });
        }
      });
    } else {
      res.json({
        valid: false,
        message: 'Email or password is wrong.',
      });
    }
  },
};
