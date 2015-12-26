var express = require('express'),
    app = express(),
    nano = require('nano')('http://localhost:5984'),
    handlebars = require('handlebars'),
    fs = require('fs');

nano.db.create('muffin', function(err, body) {

  if (!err) {
    console.log('DB created!');
  }

  var db = nano.use('muffin');

  nano.auth('ABBA', 'dancing-queen', function(err, body, headers) {

    var cookies = {};

    if (err) {
      //return console.log(err);
      return;
    }

    if (headers && headers['set-cookie']) {
      cookies['ABBAs'] = headers['set-cookie'];
    }

    console.log(null, 'You\'re an admin!');
  });

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

  var view;

  if (false) {
    view = loadView('dashboard');
  } else {
    var base = fs.readFileSync('server/templates/login.hbs', 'utf8'),
        template = handlebars.compile(base);

    var tags = {
      site: {
        name: 'Volkspark'
      }
    }

    view = template(tags);
  }

  res.send(view);

});

var server = app.listen(2000, function() {
  var port = this.address().port;
  console.log('Muffin is running at http://localhost:' + port + '/admin');
});
