import chalk from 'chalk'

export function log (message, err) {
  // Regular errors
  if (message instanceof Error) {
    console.error(err && err.stack)
    return
  }

  // Ability to add custom message to error
  if (err instanceof Error) {
    console.error(chalk.bold(message) + "\n", err.stack)
    return
  }

  // The usual loggings
  console.log(message)
}
