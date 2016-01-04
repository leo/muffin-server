const express = require('express'),
      app = express(),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      handlebars = require('express-handlebars'),
      logger = require('morgan'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      rope = require('./lib/db').rope;

process.on('SIGINT', function() {
  rope.close(function() {
    process.exit(0);
  });
});

app.use(cookieParser());

app.use(session({
  secret: 'foo',
  name: 'muffin.session',
  store: new MongoStore({
    mongooseConnection: rope
  }),
  resave: false,
  saveUninitialized: true
}));

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./lib/helpers')
}));

app.locals.menuItems = [
  {
    url: '.',
    title: 'Dashboard'
  },
  {
    url: 'pages',
    title: 'Pages'
  },
  {
    url: 'media',
    title: 'Media'
  },
  {
    url: 'settings',
    title: 'Settings'
  }
];

app.locals.appVersion = require('./package.json').version;
app.set('view engine', 'hbs');

app.use(compression());
app.use(logger('dev'));

app.use(function(req, res, next) {
  res.header('x-powered-by', 'Muffin CMS');
  next();
});

app.get('/admin*', function(req, res, next) {

  const url = req.url;

  // Check if request wants a file. If so, let it through.
  if (url.match(/[^\\/]+\.[^\\/]+$/)) {
    return next();
  }

  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }

});

app.use('/admin/assets', express.static('./dist'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/login', require('./routes/login'));
app.use('/files*', require('./routes/files'));

app.use('/admin', require('./routes/dashboard'));
app.use('/admin/pages', require('./routes/pages'));
app.use('/admin/media', require('./routes/media'));

app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
