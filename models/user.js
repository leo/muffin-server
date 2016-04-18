import { goose } from '../db'
import { log } from '../utils'
import { hash, compareSync } from 'bcryptjs'

const userSchema = goose.Schema({
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
  hash(this.password, 10, function (err, hash) {
    if (err) log(err)

    user.password = hash
    next()
  })
})

userSchema.methods.tryPassword = function (candidate) {
  // Compare candidate password to the one in the DB
  return compareSync(candidate, this.password)
}

const model = goose.model('User', userSchema)
export default model
