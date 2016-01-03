const mongoose = require('mongoose'),
      bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  _id: String,
  password: String
});

userSchema.pre('save', function(next) {

  var user = this;

  if (!user.isModified('password')) return next();

  // Auto-generates a salt and hash
  bcrypt.hash(this.password, 10, function(err, hash) {

    if (err) {
      throw err;
    }

    user.password = hash;
    next();

  });

});

userSchema.methods.tryPassword = function(candidate, cb) {

  function comparePW(err, result) {
    if (err) return cb(err);
    cb(null, result);
  }

  bcrypt.compare(candidate, this.password, comparePW);

}

module.exports = mongoose.model('User', userSchema);
