const nano = require('nano')('http://localhost:5984');

nano.db.create('muffin', function(err, body) {

  if (!err) {
    console.log('DB created!');
  }

  var db = nano.use('muffin');

});
