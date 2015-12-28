var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  const nav = [
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

  const cookie = req.cookies.AuthSession;

  if (cookie) {

    const nano = require('nano')({
      url: 'http://localhost:5984',
      cookie: 'AuthSession=' + cookie
    });

    nano.session(function(err, session) {

      const user = session.userCtx.name,
            roles = session.userCtx.roles;

      if (err || !user) {
        res.clearCookie('AuthSession');
        res.redirect('/admin/login');
        return;
      }

      var pjson = require('./package.json');

      res.render('dashboard', {
        pageTitle: 'Dashboard',
        menuItems: nav,
        appVersion: pjson.version
      });

      console.log('user is %s and has these roles: %j', user, roles);

    });

  } else {
    res.redirect('/admin/login');
  }

});

module.exports = router;
