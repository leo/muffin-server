const express = require('express'),
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

  const pjson = require('../package.json');

  res.render('dashboard', {
    pageTitle: 'Dashboard',
    menuItems: nav,
    appVersion: pjson.version
  });

});

module.exports = router;
