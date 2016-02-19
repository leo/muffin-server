const mail = require('sendmail')
const chalk = require('chalk')

exports.resetPassword = function (address) {
  mail({
    from: 'noreply@domain.de',
    to: address,
    subject: 'Reset your password',
    content: 'Ohai!'
  }, (err, reply) => {
    if (err) {
      return exports.log(err)
    }

    exports.log(reply)
  })
}

exports.log = function (message, err) {
  if (message instanceof Error) {
    console.error(err && err.stack)
    return
  }

  if (err instanceof Error) {
    console.error(message.bold, err.stack)
    return
  }

  console.log(chalk.bold(message))
}
