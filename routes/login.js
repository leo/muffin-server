const express = require('express'),
      nano = require('nano')('http://localhost:5984'),
      session = require('../lib/session'),
      router = express.Router();

router.use(function(req, res, next) {

  session.isAuthenticated(req.cookies).then(function() {
    res.redirect('/admin');
  }, function() {
    next();
  });

});

router.get('/', function(req, res, next) {

  const tags = {
    site: {
      name: 'Volkspark'
    },
    layout: false
  };

  res.clearCookie('AuthSession');
  res.render('login', tags);

});

router.post('/', function(req, res) {

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

module.exports = router;
