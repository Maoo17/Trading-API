const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const favicon = require('serve-favicon');
require('dotenv').config()


const app = express();
const port = 8334;

app.use(cors());
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const user = require('./routes/user');
const auth = require('./routes/auth');
const product = require('./routes/product');

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use('/users', user);
app.use('/auth', auth);
app.use('/products', product);

app.use(express.static('public'));

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    errors: [
      {
        status: err.status,
        title: err.message,
        detail: err.message,
      },
    ],
  });
});

server.listen(port, () => console.log(`App listening on port ${port}`))

module.exports = app;

