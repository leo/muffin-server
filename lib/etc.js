const chalk = require('chalk')

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
