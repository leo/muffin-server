const chalk = require('chalk')

module.exports = function (message, err) {
  // Regular errors
  if (message instanceof Error) {
    console.error(err && err.stack)
    return
  }

  // Ability to add custom message to error
  if (err instanceof Error) {
    console.error(message.bold, err.stack)
    return
  }

  // Errors that aren't "Error" objects
  console.log(chalk.bold(message))
}
