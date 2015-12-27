const express = require('express'),
      app = express(),
      nano = require('nano')('http://localhost:5984'),
      fs = require('fs'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      handlebars = require('express-handlebars'),
      db = nano.use('muffin');

const viewHelpers = {
  nav: function(context, options) {
    var wrap = '<nav>';

    for (var i = 0; i < context.length; i++) {
      wrap += options.fn(context[i]);
    }

    return wrap + '</nav>';
  }
}

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: 'server/views/layouts',
  helpers: viewHelpers
}));

app.set('view engine', 'hbs');
app.set('views', 'server/views');

app.use(compression());
app.use(cookieParser());

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

app.get('/admin', function(req, res) {

  const nav = [
    {
      url: '/',
      title: 'Dashboard'
    },
    {
      url: '/pages',
      title: 'Pages'
    },
    {
      url: '/media',
      title: 'Media'
    },
    {
      url: '/settings',
      title: 'Settings'
    }
  ];

  const cookie = req.cookies.AuthSession;

  const loginTags = {
    site: {
      name: 'Volkspark'
    },
    layout: false
  };

  if (cookie) {

    const nano = require('nano')({
      url: 'http://localhost:5984',
      cookie: 'AuthSession=' + cookie
    });

    nano.session(function(err, session) {

      if (err) {
        return res.render('login', loginTags);
      }

      res.render('dashboard', {
        pageTitle: 'Dashboard',
        menuItems: nav
      });

      console.log('user is %s and has these roles: %j', session.userCtx.name, session.userCtx.roles);

    });

  } else {
    res.render('login', loginTags);
  }

});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/api/login', function(req, res) {

  const username = req.body.username,
        password = req.body.password;

  if (!username || !password) {
    res.sendStatus(401);
    return;
  }

  nano.auth(username, password, function(err, body, headers) {

    if (err) {
      res.sendStatus(401);
      return;
    }

    if (headers && headers['set-cookie']) {
      res.cookie(headers['set-cookie']);
    }

    res.sendStatus(200);

  });

  console.log(req.body);

});

app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
