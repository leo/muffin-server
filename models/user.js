const mongoose = require('../lib/db').goose
const log = require('../lib/log')

const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  _id: String,
  password: String,
  email: String
})

userSchema.pre('save', function (next) {
  var user = this

  // Only hash & salt password field if it differs from the
  // one within the DB
  if (!user.isModified('password')) return next()

  // Auto-generates a salt and hash
  bcrypt.hash(this.password, 10, function (err, hash) {
    if (err) log(err)

    user.password = hash
    next()
  })
})

userSchema.methods.tryPassword = function (candidate) {
  // Compare candidate password to the one in the DB
  return bcrypt.compareSync(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
