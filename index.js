const express = require('express'),
      app = express(),
      nano = require('nano')('http://localhost:5984'),
      handlebars = require('handlebars'),
      fs = require('fs'),
      compression = require('compression'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      db = nano.use('muffin');

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

function loadView(view, err, content) {

  if (err) {
    console.log(err);
    return;
  }

  var look = fs.readFileSync('server/views/' + view + '.hbs', 'utf8'),
    template = handlebars.compile(look);

  if (view !== 'edit') {
    var other = {
      items: content
    }
  }

  var tags = {
    pageTitle: function() {
      switch(view) {
        case 'dashboard':
          return 'Dashboard';

        case 'edit':
          return content.title;

        case 'list':
          return 'Pages';

        default:
          return 'Error 404';
      }
    },
    content: template(view == 'edit' ? content : other),
    view: view
  }

  var base = fs.readFileSync('server/templates/admin.hbs', 'utf8'),
    container = handlebars.compile(base);

  return container(tags);
}

app.get( '/admin', function(req, res) {

  const cookie = req.cookies.AuthSession;

  const getLogin = function() {

    var base = fs.readFileSync('server/templates/login.hbs', 'utf8'),
        template = handlebars.compile(base);

    var tags = {
      site: {
        name: 'Volkspark'
      }
    }

    return template(tags);
  }

  if (cookie) {

    const nano = require('nano')({
      url: 'http://localhost:5984',
      cookie: 'AuthSession=' + cookie
    });

    nano.session(function(err, session) {

      if (err) {
        return res.send(getLogin());
      }

      res.send(loadView('dashboard'));
      console.log('user is %s and has these roles: %j', session.userCtx.name, session.userCtx.roles);

    });

  } else {
    res.send(getLogin());
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

var server = app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
