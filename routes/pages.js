const express = require('express'),
      router = express.Router();

router.get('/', function(req, res) {

  res.render('list', {
    pageTitle: 'Pages',
    path: req.originalUrl
  });

});

router.get('/:id', function(req, res) {
  
  res.render('edit', {
    pageTitle: 'LOL - what?',
    editableTitle: true,
    path: req.originalUrl
  });

});

module.exports = router;
