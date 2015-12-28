var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (false) {
    res.redirect('/admin');
    return;
  }

  const tags = {
    site: {
      name: 'Volkspark'
    },
    layout: false
  };

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
