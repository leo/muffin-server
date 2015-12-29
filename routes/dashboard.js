const express = require('express'),
      router = express.Router();

router.get('/', function(req, res) {

  res.render('dashboard', {
    pageTitle: 'Dashboard'
  });

});

module.exports = router;
