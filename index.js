const express = require('express'),
      app = express(),
      nano = require('nano')('http://localhost:5984'),
      fs = require('fs'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      handlebars = require('express-handlebars'),
      logger = require('morgan'),
      session = require('./lib/session'),
      db = nano.use('muffin');

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./lib/helpers')
}));

app.set('view engine', 'hbs');

app.use(compression());
app.use(cookieParser());
app.use(logger('dev'));

app.use(function(req, res, next) {
  res.header('x-powered-by', 'Muffin CMS');
  next();
});

nano.db.create('muffin', function(err, body) {
  if (!err) {
    console.log('DB created!');
  }
});

app.get('/admin*', function(req, res, next) {

  const url = req.url;

  // Check if request wants a file or the login. If so, let it through
  if (url.match(/[^\\/]+\.[^\\/]+$/) || url.substring(0, 12) == '/admin/login') {
    return next();
  }

  session.isAuthenticated(req.cookies).then(function() {
    next();
  }, function() {
    res.redirect('/admin/login');
  });

});

app.use('/admin/assets', express.static('./dist'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/admin', require('./routes/dashboard'));
app.use('/admin/login', require('./routes/login'));

app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
