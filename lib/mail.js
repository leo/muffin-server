const mail = require('sendmail')

exports.resetPassword = function (address) {
  mail({
    from: 'noreply@domain.de',
    to: address,
    subject: 'Reset your password',
    content: 'Ohai!'
  }, (err, reply) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(reply)
  })
}
