const express = require('express'),
      session = require('../lib/auth'),
      router = express.Router();

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

  session.isAuthenticated(req.cookies).then(function() {

    var pjson = require('../package.json');

    res.render('dashboard', {
      pageTitle: 'Dashboard',
      menuItems: nav,
      appVersion: pjson.version
    });

  }, function(reason) {
    res.redirect('/admin/login');
  });

});

module.exports = router;
