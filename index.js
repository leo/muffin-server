const express = require('express'),
      app = express(),
      nano = require('nano')('http://localhost:5984'),
      fs = require('fs'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      handlebars = require('express-handlebars'),
      logger = require('morgan'),
      db = nano.use('muffin');

const viewHelpers = {
  nav: function(context, options) {
    var wrap = '<nav>';

    for (var i = 0; i < context.length; i++) {
      var item = context[i];

      if (item.title.toLowerCase() == options.data.exphbs.view) {
        item.status = 'active';
      }

      item.url = '/admin/' + item.url;
      wrap += options.fn(item);
    }

    return wrap + '</nav>';
  }
}

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: viewHelpers
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

app.use( '/admin/assets', express.static('dist') );
app.use('/admin', require('./routes'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/admin/login', require('./routes/login'));

app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
